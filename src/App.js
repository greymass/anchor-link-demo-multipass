// React and UI components for demo
import React, { Component } from 'react'
import { Button, Container, Header, Segment } from 'semantic-ui-react'

// The required anchor-link includes
import AnchorLink from 'anchor-link-localstorage-persist'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

// React components for this demo, not required
import { find } from 'lodash'
import blockchains from './assets/blockchains.json'
import Accounts from './Accounts.js'
import Blockchains from './Blockchains.js'
import Response from './Response.js'
import ExampleSign from './examples/Sign'

class App extends Component {
  // Demo initialization code
  constructor(props) {
    super(props)
    // Add the ability to retrieve the chainId from the URL
    const search = window.location.search
    const params = new URLSearchParams(search)
    const chainId = params.get('chainId') || '0db13ab9b321c37c0ba8481cb4681c2788b622c3abfd1f12f0e5353d44ba6e72'
    // Set initial blank application state
    this.state = {
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
      const identity = await this.link.login('anchor-link-demo-multipass', { chainId })
      // Retrieve a list of all available sessions to update demo state
      const sessions = this.link.sessions(chainId)
      // Update state with the current session and all available sessions
      this.setState({
        session: identity.session,
        sessions,
      })
    } catch(e) {
      console.log(e)
    }
  }
  establishLink = () => {
    // Load the current chainId from state
    const { chainId } = this.state
    // Find the blockchain and retrieve the appropriate API endpoint for the demo
    const blockchain = find(blockchains, { chainId })
    const rpc = blockchain.rpcEndpoints[0]
    // Initialize anchor-link using the local storage persist module
    this.link = new AnchorLink({
      // Specify the target chainId
      chainId,
      // Set the API to use
      rpc: `${rpc.protocol}://${rpc.host}:${rpc.port}`,
      // Optional: Set the callback service, which will default to https://cb.anchor.link
      service: 'https://cb.anchor.link',
      // Optional: The local storage key prefix to store data with
      storageKeyPrefix: 'multipass',
      // Pass in the browser transport
      transport: new AnchorLinkBrowserTransport(),
    })
    // Attempt to restore the last used session for this particular chainId
    const session = this.link.restore(chainId)
    // Load all existing sessions for this chain
    const sessions = this.link.sessions(chainId)
    // Save current chainId and session into application state
    this.setState({
      chainId,
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
      // Call transact on the session
      const result = await session.transact({
        actions: [
          {
            account: 'eosio',
            name: 'voteproducer',
            authorization: [session.auth],
            data: {
              producers: [],
              proxy: 'greymassvote',
              voter: session.auth.actor
            }
          }
        ],
        // Optional: Whether anchor-link should broadcast this transaction
        //    For this demo, anchor-link will not broadcast the transaction after receiving it
        broadcast: false,
        // Optional: TAPOS values
        blocksBehind: 3,
        expireSeconds: 120,
      })
      // Update application state with the results of the transaction
      this.setState({ response: result })
    } catch(e) {
      console.log(e)
    }
  }
  // React State Helper to update chainId while switching blockchains
  setChainId = (e, { value }) => this.setState({
    chainId: value,
    response: undefined,
  })
  // React State Helper to update sessions while switching accounts
  setSession = (chainId, accountName, permissionName) => {
    // Restore a specific session based on chainId, accountName, and permissionName
    const session = this.link.restore(chainId, accountName, permissionName)
    // Update application state with new session and reset response data
    this.setState({
      response: undefined,
      session,
    })
  }
  // React State Helper to remove/delete a session
  removeSession = (chainId, accountName, permissionName) => {
    // Remove from local storage based on chainId, accountName, and permissionName
    this.link.remove(chainId, accountName, permissionName)
    // Remove from local application state
    const { session, sessions } = this.state
    // If this was the currently active account, remove the session
    if (session && session.auth.actor === accountName && session.auth.permission === permissionName) {
      this.setState({ session: undefined });
    }
    this.setState({
      sessions: sessions.filter(s => !(s.chainId === chainId && s.accountName === accountName && s.permissionName === permissionName))
    })
  }
  render() {
    // Load state for rendering
    const {
      chainId,
      session,
      sessions,
      response,
    } = this.state
    // Find the blockchain information (rpc, name, etc) for UI purposes
    const chain = find(blockchains, { chainId })
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
          <p>Switch to a specific blockchain.</p>
          <Blockchains
            chain={chain}
            onChange={this.setChainId}
          />
        </Segment>
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
        <Segment attached padded>
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
          <Header>Sample Code</Header>
          <ExampleSign />
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
