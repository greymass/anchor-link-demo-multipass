import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react';
import ReactJson from 'react-json-view';
import { CodeBlock, monokai } from 'react-code-blocks'


class Transaction extends Component {
  render() {
    const { response } = this.props;
    return (
      <React.Fragment>
        <Segment style={{ background: 'rgb(39, 40, 34)' }}>
          <Header dividing size="large" style={{ borderBottom: '1px solid white', color: 'white' }}>
            Callback Payload
          </Header>
          <CodeBlock
            text={`console.log(response.payload);`}
            language={"javascript"}
            showLineNumbers={false}
            theme={monokai}
            wrapLines
          />
          <ReactJson
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            iconStyle="square"
            name={null}
            src={response.payload}
            style={{
              background: 'rgb(39, 40, 34)',
              marginTop: '1em',
              overflow: 'scroll',
            }}
            theme="harmonic"
          />
        </Segment>
        <Segment style={{ background: 'rgb(39, 40, 34)' }}>
          <Header dividing size="large" style={{ borderBottom: '1px solid white', color: 'white' }}>
            Signatures
          </Header>
          <CodeBlock
            text={`console.log(response.signatures);`}
            language={"javascript"}
            showLineNumbers={false}
            theme={monokai}
            wrapLines
          />
          <ReactJson
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            iconStyle="square"
            name={null}
            src={response.signatures}
            style={{
              background: 'rgb(39, 40, 34)',
              marginTop: '1em',
              overflow: 'scroll',
            }}
            theme="harmonic"
          />
        </Segment>
        <Segment style={{ background: 'rgb(39, 40, 34)' }}>
          <Header dividing size="large" style={{ borderBottom: '1px solid white', color: 'white' }}>
            Signer
          </Header>
          <CodeBlock
            text={`console.log(response.signer);`}
            language={"javascript"}
            showLineNumbers={false}
            theme={monokai}
            wrapLines
          />
          <ReactJson
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            iconStyle="square"
            name={null}
            src={response.signer}
            style={{
              background: 'rgb(39, 40, 34)',
              marginTop: '1em',
              overflow: 'scroll',
            }}
            theme="harmonic"
          />
        </Segment>
        <Segment style={{ background: 'rgb(39, 40, 34)' }}>
          <Header dividing size="large" style={{ borderBottom: '1px solid white', color: 'white' }}>
            Transaction
          </Header>
          <CodeBlock
            text={`console.log(response.transaction);`}
            language={"javascript"}
            showLineNumbers={false}
            theme={monokai}
            wrapLines
          />
          <ReactJson
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            iconStyle="square"
            name={null}
            src={response.transaction}
            style={{
              background: 'rgb(39, 40, 34)',
              marginTop: '1em',
              overflow: 'scroll',
            }}
            theme="harmonic"
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Transaction;
