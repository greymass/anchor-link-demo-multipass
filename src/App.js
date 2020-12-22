// React and UI components for demo
import React, { Component } from 'react'
import { Button, Container, Header, Segment } from 'semantic-ui-react'

// The required anchor-link includes
import AnchorLink, {LinkSession} from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

// Optional interfaces to import from anchor-link
import { PermissionLevel } from 'anchor-link'

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
  }
  addAccount = async () => {
    const { chainId } = this.state
    try {
      // Use the anchor-link login method with the chain id to establish a session
      const identity = await this.link.login('anchor-link-demo-multipass')
      // Retrieve a list of all available sessions to update demo state
      const sessions = await this.link.listSessions('anchor-link-demo-multipass')
      // Update state with the current session and all available sessions
      this.setState({
        error: undefined,
        response: undefined,
        // proofKey,
        // proofValid,
        session: identity.session,
        sessions,
      })
    } catch(e) {
      console.log(e)
    }
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
    const chains = blockchains.map(b => ({
      chainId: b.chainId,
      nodeUrl: `${b.rpcEndpoints[0].protocol}://${b.rpcEndpoints[0].host}:${b.rpcEndpoints[0].port}`
    }))
    console.log(chains)
    // Initialize anchor-link using the local storage persist module
    this.link = new AnchorLink({
      // Specify the target chainId
      chains,
      // Optional: Set the callback service, which will default to https://cb.anchor.link
      service: 'https://cb.anchor.link',
      // Pass in the browser transport
      transport: new AnchorLinkBrowserTransport({
        // Optional: Referral account for Greymass Fuel
        fuelReferrer: 'jesta.x'
        // Optional: Fuel by default is used to sign transactions for users with low resources.
        //            This can be disabled by setting disableGreymassFuel to true.
        // disableGreymassFuel: true,
        // Optional: Disable the browser transport success/failure messages to serve your own
        // requestStatus: false
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
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: String(session.auth.actor),
          permission: String(session.auth.permission),
        }],
        data: {
          from: String(session.auth.actor),
          to: 'teamgreymass',
          quantity: '0.0001 EOS',
          memo: '',
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
      chainId,
      demoMode,
      demo2Mode,
      error,
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
