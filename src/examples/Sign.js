import React, { Component } from 'react'
import { CodeBlock, monokai } from 'react-code-blocks'
import { Header, Segment, Tab } from 'semantic-ui-react'

const exampleInit = `import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

async function login(chainId) {
      const link = new AnchorLink({
            chainId,
            rpc: 'https://api.domain.com',
            transport: new AnchorLinkBrowserTransport(),
      })
      const identity = await link.login('anchor-link-demo-multipass', { chainId })
      const { session } = identity
      return session
}`;

const exampleTransact = `const response = await session.transact({
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
      broadcast: false,
      blocksBehind: 3,
      expireSeconds: 120,
});
`;

export default class ExampleSign extends Component {
  render() {
    const init = (
      <Segment attached style={{ background: 'rgb(39, 40, 34)' }}>
        <Header dividing size="large" style={{ borderBottom: '1px solid white', color: 'white' }}>
          Example: Initialize anchor-link
        </Header>
        <CodeBlock
          text={exampleInit}
          language={"javascript"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
      </Segment>
    )
    const transact = (
      <Segment attached style={{ background: 'rgb(39, 40, 34)' }}>
        <Header dividing size="large" style={{ borderBottom: '1px solid white', color: 'white' }}>
          Example: Issuing Transaction
        </Header>
        <CodeBlock
          text={exampleTransact}
          language={"javascript"}
          showLineNumbers={false}
          theme={monokai}
          wrapLines
        />
      </Segment>
    )
    const panes = [
      { menuItem: 'Initialize', render: () => init },
      { menuItem: 'Transact', render: () => transact },
    ]
    return <Tab panes={panes} />
  }
}
