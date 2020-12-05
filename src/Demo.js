import React, { Component } from 'react'
import {
  Button,
  Container,
  Form,
  Header,
  Segment,
} from 'semantic-ui-react';

class Demo extends Component {
  render() {
    const { session } = this.props;
    return (
      <Container fluid>
        <Segment
          secondary
          style={{
            height: '100vh'
          }}
        >
          <Container>
            <Segment basic padded secondary size="large">
              <Header size="large">
                EOS Demo Application
                <Header.Subheader>
                  Simple app to illustrate Anchor features and integrations.
                </Header.Subheader>
              </Header>
              {(session)
                ? (
                  <Segment
                    attached="top"
                    textAlign="center"
                  >
                    <p>
                      You are currently signed in as
                      {' '}
                      <a href={`https://bloks.io/account/${String(session.auth.actor)}`}>
                        {String(session.auth.actor)}
                      </a>
                      .
                    </p>
                    <Button
                      basic
                      content={`Sign out`}
                      icon="log out"
                      onClick={() => this.props.removeSession(session.auth)}
                    />
                  </Segment>
                )
                : (
                  <Segment
                    textAlign="center"
                  >
                    <p>To get started, please sign in with an EOS account!</p>
                    <Button
                      content="Sign in"
                      onClick={this.props.addAccount}
                      icon="user outline"
                      primary
                    />
                  </Segment>
                )
              }
              {(session)
                ? (
                  <Segment attached="bottom" padded>
                    <p>Sample form to send EOS tokens</p>
                    <Form>
                      <Form.Field>
                        <label>To:</label>
                        <Form.Input value="teamgreymass" />
                      </Form.Field>
                      <Form.Field>
                        <label>Amount:</label>
                        <Form.Input value="0.0001" />
                      </Form.Field>
                      <Form.Field>
                        <label>Memo:</label>
                        <Form.Input />
                      </Form.Field>
                    </Form>
                    <Button
                      centered
                      content="Transfer Tokens"
                      onClick={this.props.signTransaction}
                      primary
                      size="large"
                      style={{ marginTop: '1em' }}
                    />
                  </Segment>
                )
                : false
              }
            </Segment>
          </Container>
        </Segment>
      </Container>
    );
  }
}

export default Demo;
