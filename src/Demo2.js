import React, { Component } from 'react'
import {
  Button,
  Container,
  Form,
  Header,
  List,
  Segment,
} from 'semantic-ui-react';

const url = "esr:AwAAAwngdBFc2tA0AAI7aHR0cHM6Ly9jYi5hbmNob3IubGluay9lZGE5OGU2Mi1lNzdmLTQzMjMtYmJhNy0wYjAwNGQ0ZDM0YWYDBGxpbmsqCeB0EVza0DQAA8zPgeqlfIcW5YTDmGtxOmIvthVeViYz75zoCmjKVYhPBXNjb3BlGmFuY2hvci1saW5rLWRlbW8tbXVsdGlwYXNzCWNoYWluX2lkc80BCQABAAwBzwV7v7cmQEcf2RC8tnY5wi35-SRwk2zdwa3g4vLn3E8BsgkBOAr0TvWcWRhDmh-aQdg2aQIDGagFdLgEpflcvX4AAwEqAqAFPlqM9zpWug_aEeTZLgI4pKKqdPzPRtWpEHRoQAFx7oO89SFC1hAZ2V-cxUJ7pqDX_4rM2eIIiuKr6vPT3QEeqggkcHyMFr0lFFSTvwYq7N3-tWxzb2umOX8xlfM8nwHxaxgzx0fENoL0OG_KnLsyeSkzSnYnVevsF_byPJuKEg"

class Demo extends Component {
  button2() {
    window.location = url
  }
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
                EOS URI Triggering Demo
                <Header.Subheader>
                  Simple app to illustrate different ways to trigger URIs.
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
                      onClick={() => this.props.removeSession(session)}
                    />
                  </Segment>
                )
                : (
                  <Segment
                    textAlign="center"
                  >
                    <p>To get started, please sign in with an EOS account!</p>
                    <List>
                      <List.Item>
                        <Button
                          content="Sign in (Normal)"
                          onClick={this.props.addAccount}
                          icon="user outline"
                          primary
                        />
                      </List.Item>
                      <List.Item>
                        <Button
                          as="a"
                          content="Sign in (href)"
                          href={url}
                          icon="user outline"
                          primary
                        />
                      </List.Item>
                      <List.Item>
                        <Button
                          content="Sign in (window.location)"
                          onClick={this.button2}
                          icon="user outline"
                          primary
                        />
                      </List.Item>
                    </List>
                  </Segment>
                )
              }
            </Segment>
          </Container>
        </Segment>
      </Container>
    );
  }
}

export default Demo;
