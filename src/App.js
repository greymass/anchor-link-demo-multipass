// React and UI components for demo
import React, { Component } from 'react'
import { Button, Container, Header, Label, Message, Segment, Table } from 'semantic-ui-react'

// The required anchor-link includes
import AnchorLink, {ChainId, LinkSession} from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

// Optional interfaces to import from anchor-link
import { APIError } from '@greymass/eosio'
import { IdentityProof } from 'eosio-signing-request'

// React components for this demo, not required
import { find } from 'lodash'
import blockchains from './assets/blockchains.json'
import Accounts from './Accounts.js'
import Blockchains from './Blockchains.js'
import DemoApp from './Demo.js'
import Demo2App from './Demo2.js'
import SigningError from './SigningError.js'
import Response from './Response.js'

class App extends Component {
  // Demo initialization code
  constructor(props) {
    super(props)
    // Add the ability to retrieve the chainId from the URL
    const search = window.location.search
    const params = new URLSearchParams(search)
    const chainId = params.get('chainId') || '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840'
    const demoMode = !!params.get('demo')
    const demo2Mode = !!params.get('demo2')
    // Set initial blank application state
    this.state = {
      account: {},
      demoMode,
      demo2Mode,
      error: undefined,
      response: undefined,
      session: undefined,
      sessions: [],
      chainId,
    }
  }
  componentDidMount() {
    // Configure anchor-link when this component mounts
    this.establishLink()
  }
  componentDidUpdate(prevProps, prevState) {
    // If the chainId changes in state, reconfigure anchor-link for that chain
    if (this.state.chainId !== prevState.chainId) {
      this.establishLink()
    }
    // Logic to detect user change in state
    if (
      this.state.session
      && prevState.session
      && !prevState.session.auth.actor.equals(this.state.session.auth.actor)
    ) {
      this.refreshAccount()
    }
  }
  refreshAccount = async () => {
    const {client} = this.link
    const {actor} = this.state.session.auth
    const account = await client.v1.chain.get_account(actor)
    this.setState({
      account
    })
  }

  verifyProof = async (identity) => {
    // Generate an array of valid chain IDs from the demo configuration
    const chains = blockchains.map(chain => chain.chainId)

    // Create a proof helper based on the identity results from anchor-link
    const proof = IdentityProof.from(identity.proof)

    // Check to see if the chainId from the proof is valid for this demo
    const chain = chains.find(id => ChainId.from(id).equals(proof.chainId))
    if (!chain) {
        throw new Error('Unsupported chain supplied in identity proof')
    }

    // Load the account data from a blockchain API
    let account
    try {
      account = await this.link.client.v1.chain.get_account(proof.signer.actor)
    } catch (error) {
        if (error instanceof APIError && error.code === 0) {
            throw new Error('No such account', 401)
        } else {
            throw error
        }
    }

    // Retrieve the auth from the permission specified in the proof
    const auth = account.getPermission(proof.signer.permission).required_auth

    // Determine if the auth is valid with the given proof
    const valid = proof.verify(auth, account.head_block_time)

    // If not valid, throw error
    if (!valid) {
        throw new Error('Proof invalid or expired', 401)
    }

    // Recover the key from this proof
    const proofKey = proof.recover();

    // Return the values expected by this demo application
    return {
      account,
      proof,
      proofKey,
      proofValid: valid,
    }
  }
  addAccount = async () => {
    // try {
      // Use the anchor-link login method with the chain id to establish a session
      const identity = await this.link.login('anchor-link-demo-multipass')

      // (OPTIONAL) Verify the identity proof
      const {
        account,
        proof,
        proofKey,
        proofValid,
      } = await this.verifyProof(identity)

      // Retrieve a list of all available sessions to update demo state
      const sessions = await this.link.listSessions('anchor-link-demo-multipass')
      // Update state with the current session and all available sessions
      this.setState({
        account,
        error: undefined,
        response: undefined,
        proof,
        proofKey: String(proofKey),
        proofValid,
        session: identity.session,
        sessions,
      })
    // } catch(e) {
    //   console.log(e)
    // }
  }
  toSimpleObject = (v) => JSON.parse(JSON.stringify(v))
  establishLink = async () => {
    /*
      Specify the blockchains that are available to use within this application.

      The format is an array of chain definitions:

      {
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        nodeUrl: "https://eos.greymass.com"
      }

    */
    // Initialize anchor-link using the local storage persist module
    this.link = new AnchorLink({
      // For a list of all options, please visit:
      //   https://github.com/greymass/anchor-link/blob/eosio-core/src/link-options.ts#L24-L82
      // ---
      // REQUIRED: Specify the supported chains
      chains: blockchains.map(b => ({
        chainId: b.chainId,
        nodeUrl: `${b.rpcEndpoints[0].protocol}://${b.rpcEndpoints[0].host}:${b.rpcEndpoints[0].port}`
      })),
      // ---
      // OPTIONAL: Set a custom API Client https://github.com/greymass/eosio-core/blob/master/src/api/client.ts
      // client: new APIClient(...),
      // ---
      // OPTIONAL: Set the callback service, which will default to https://cb.anchor.link
      // service: 'https://cb.anchor.link',
      // ---
      // OPTIONAL: Identity proof verification, defaults to `true`
      // verifyProofs: false,
      // ---
      // REQUIRED: Pass in the browser transport
      transport: new AnchorLinkBrowserTransport({
        // For a list of all optons, please visit:
        //   https://github.com/greymass/anchor-link-browser-transport/blob/eosio-core/src/index.ts#L16-L41
        // ---
        // OPTIONAL: Fuel by default is used to sign transactions for users with low resources.
        //            This can be disabled by setting disableGreymassFuel to true.
        // disableGreymassFuel: true,
        // ---
        // OPTIONAL: Referral account for Greymass Fuel
        // fuelReferrer: 'jesta.x',
        // ---
        // OPTIONAL: Disable the browser transport success/failure messages to serve your own
        // requestStatus: false
        // ---
      }),
    })
    // Attempt to restore the last used session for this particular chainId
    const session = await this.link.restoreSession('anchor-link-demo-multipass')
    // Load all existing sessions for this chain
    const sessions = await this.link.listSessions('anchor-link-demo-multipass')
    // Save current chainId and session into application state
    this.setState({
      error: undefined,
      session,
      sessions,
    }, () => {
      if (session) {
        this.refreshAccount()
      }
    })
    // Return in the event we need to immediately use
    return this.link
  }
  signTransaction = async () => {
    // Retrieve current session from state
    const { session } = this.state
    try {
      // Reset our response state to clear any previous transaction data
      this.setState({ response: undefined })
      const action = {
        authorization: [{
          actor: String(session.auth.actor),
          permission: String(session.auth.permission),
        }],
        account: 'eosio',
        name: 'voteproducer',
        data: {
          voter: String(session.auth.actor),
          producers: ['teamgreymass'],
          proxy: '',
        }
      }
      // Call transact on the session (compatible with eosjs.transact)
      const response = await session.transact({
        actions: [action]
      }, {
        // Optional: Prevent anchor-link from broadcasting this transaction (default: True)
        //
        //    The wallet/signer connected to this app will NOT broadcast the transaction
        //    as is defined by the anchor-link protocol. Broadcasting is the responsibility
        //    of anchor-link running inside an application (like this demo).
        //
        //    For this demo specifically we do NOT want the transaction to ever be broadcast
        //    to the blockchain, so we're disabling it here.
        //
        //    For all normal applications using anchor-link, you can omit this.
        //
        broadcast: false,
      })
      // Update application state with the responses of the transaction
      this.setState({
        error: undefined,
        response,
      })
    } catch(e) {
      console.log(e)
      this.setState({ error: e })
    }
  }
  // React State Helper to update chainId while switching blockchains
  setChainId = (e, { value }) => this.setState({
    chainId: value,
    error: undefined,
    response: undefined,
  }, () => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('chainId', value)
    window.history.pushState(null, null, `?${searchParams.toString()}`)
  })
  // React State Helper to update sessions while switching accounts
  setSession = async (ls:LinkSession) => {
    // Restore a specific session based on an auth (e.g. {actor: 'foo', permission: 'bar'})
    const session = await this.link.restoreSession('anchor-link-demo-multipass', ls.auth, ls.chainId)
    // Update application state with new session and reset response data
    this.setState({
      error: undefined,
      response: undefined,
      session,
    })
  }
  // React State Helper to remove/delete a session
  removeSession = async (ls:LinkSession) => {
    // Remove from local storage based on an auth (e.g. {actor: 'foo', permission: 'bar'})
    await this.link.removeSession('anchor-link-demo-multipass', ls.auth, ls.chainId)
    // Remove from local application state
    const { session, sessions } = this.state
    // If this was the currently active account, remove the session
    if (session && session.auth.actor.equals(ls.auth.actor) && session.auth.permission.equals(ls.auth.permission)) {
      this.setState({ session: undefined });
    }
    this.setState({
      sessions: sessions.filter(s => !(s.auth.actor.equals(ls.auth.actor) && s.auth.permission.equals(ls.auth.permission)))
    })
  }
  render() {
    // Load state for rendering
    const {
      account,
      chainId,
      demoMode,
      demo2Mode,
      error,
      proof,
      proofKey,
      proofValid,
      session,
      sessions,
      response,
    } = this.state
    // Find the blockchain information (rpc, name, etc) for UI purposes
    const chain = find(blockchains, { chainId })
    // If the demo parameter is set in the URL, render a nicer looking demo app
    if (demoMode) {
      return (
        <DemoApp
          addAccount={this.addAccount}
          chain={chain}
          loggedIn={!session}
          session={session}
          sessions={sessions}
          setSession={this.setSession}
          signTransaction={this.signTransaction}
          removeSession={this.removeSession}
        />
      )
    }
    if (demo2Mode) {
      return (
        <Demo2App
          addAccount={this.addAccount}
          chain={chain}
          loggedIn={!session}
          session={session}
          sessions={sessions}
          setSession={this.setSession}
          signTransaction={this.signTransaction}
          removeSession={this.removeSession}
        />
      )
    }
    // Return the UI
    return (
      <Container
        style={{ paddingTop: '2em' }}
      >
        <Header attached="top" block size="huge">
          anchor-link-demo-multipass
          <Header.Subheader>
            <p>An anchor-link demo that allows multiple persistent logins from different blockchains and accounts.</p>
            <p>Source code: <a href="https://github.com/greymass/anchor-link-demo-multipass">https://github.com/greymass/anchor-link-demo-multipass</a></p>
          </Header.Subheader>
        </Header>
        <Segment attached padded>
          <Header>Available Accounts</Header>
          <Accounts
            addAccount={this.addAccount}
            chain={chain}
            session={session}
            sessions={sessions}
            setSession={this.setSession}
            removeSession={this.removeSession}
          />
          {(proofKey)
            ? (
              <React.Fragment>
                <Message
                  attached="top"
                  content="The information below verifies the users identity. If you need it for future use, save it within your application. It is only available immediately after sign in."
                  header="Account Successfully Authenticated"
                  success
                />
                <Table definition attached="bottom" size="small">
                  <Table.Row>
                    <Table.Cell>Valid</Table.Cell>
                    <Table.Cell>
                      {proofValid ? (
                        <Label color="green" content="True" />
                      ) : (
                        <Label color="orange" content="False" />
                      )}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Chain ID</Table.Cell>
                    <Table.Cell>{String(proof.chainId)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Permission</Table.Cell>
                    <Table.Cell>{String(proof.signer)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Signature</Table.Cell>
                    <Table.Cell>{String(proof.signature)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Public Key</Table.Cell>
                    <Table.Cell>{proofKey}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Proof Valid Until</Table.Cell>
                    <Table.Cell>{String(proof.expiration)}</Table.Cell>
                  </Table.Row>
                </Table>
              </React.Fragment>
            )
            : false
          }
        </Segment>
        <Segment attached padded>
          <Header>
            Account Data
            <Header.Subheader>Example rendering data from API client call</Header.Subheader>
          </Header>
            {(account && account.cpu_limit)
              ? (
                <p>CPU: {String(account.cpu_limit.available)}μs / {String(account.cpu_limit.max)}μs</p>
              )
              : (
                <p>Account not loaded.</p>
              )
            }

        </Segment>
        <Segment attached padded textAlign="center">
          <Header>Transact with anchor-link</Header>
          <Button
            content="Sign Test Transaction"
            disabled={!session}
            icon="external"
            onClick={this.signTransaction}
            primary
            size="huge"
          />
          {(!session)
            ? <p style={{ marginTop: '0.5em'}}>Login using anchor-link to sign a test transaction.</p>
            : false
          }
        </Segment>
        <Segment attached="bottom" padded>
          {(error)
            ? (
              <SigningError
                error={error}
              />
            )
            : false
          }
          {(response)
            ? (
              <Response
                response={response}
              />
            )
            : false
          }
        </Segment>
      </Container>
    )
  }
}

export default App
