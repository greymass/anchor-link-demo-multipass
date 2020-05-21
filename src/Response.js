import React, { Component } from 'react'
import { Header, List, Segment } from 'semantic-ui-react';
import ReactJson from 'react-json-view';
import { CodeBlock, monokai } from 'react-code-blocks'

import { Serialize } from 'eosjs'
const transactionAbi = require('eosjs/src/transaction.abi.json')
const transactionTypes: Map<string, Serialize.Type> = Serialize.getTypesFromAbi(Serialize.createInitialTypes(), transactionAbi)

class Transaction extends Component {
  testResponse = () => {
    const { response } = this.props
    const tests = [
      {
        name: "Signatures returned by signer",
        desc: "The signer has returned signatures in its response.",
        test: (r) => !!(r.signatures && r.signatures.length >= 1),
        data: (r) => JSON.stringify(r.signatures),
      },
      {
        name: "Unserialized transaction returned by signer",
        desc: "The signer has returned an unserialized transaction in its response.",
        test: (r) => !!(r.transaction),
        data: (r) => JSON.stringify(r.transaction),
      },
      {
        name: "Serialized transaction returned by signer",
        desc: "The signer has returned a serialized transaction in its response.",
        test: (r) => !!(r.serializedTransaction),
        data: (r) => JSON.stringify(r.serializedTransaction),
      },
      {
        name: "Serialized transaction successfully deserialized",
        desc: "The serialized transaction the signer returned can be successfully deserialized.",
        test: (r) => {
          try {
            const tx = this.deserialize(r.serializedTransaction)
            return (
              tx.expiration
              && tx.actions
              && tx.actions.length > 0
              && tx.ref_block_num > 0
              && tx.ref_block_prefix > 0
            )
          } catch (e) {
            return false
          }
        },
        data: (r) => {
          try {
            const tx = this.deserialize(r.serializedTransaction)
            return JSON.stringify(tx)
          } catch (e) {
            return JSON.stringify({})
          }
        }
      },
    ]
    return tests.map((testCase) => {
      return {
        ...testCase,
        res: testCase.test(response),
        val: testCase.data(response),
      }
    })
  }
  deserialize = (serialized) => {
    const buffer = new Serialize.SerialBuffer({
      array: serialized,
    })
    const type = transactionTypes.get('transaction')
    return type.deserialize(buffer)
  }
  render() {
    const { response } = this.props;
    const tests = this.testResponse()
    return (
      <React.Fragment>
        <Segment style={{ overflowX: 'scroll' }}>
          <List divided relaxed>
            {tests.map(test => (
              <List.Item>
                <List.Icon
                  color={test.res ? "green" : "red"}
                  name={test.res ? "checkmark" : "x"}
                  size="large"
                  verticalAlign="top"
                />
                <List.Content>
                  <List.Header>{test.name}</List.Header>
                  <List.Description>{test.desc}</List.Description>
                  <List.Content style={{ margin: '0.5em 0' }}><code>{test.val}</code></List.Content>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
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
      </React.Fragment>
    );
  }
}

export default Transaction;
