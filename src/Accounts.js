import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react';
import { find } from 'lodash'

import blockchains from './assets/blockchains.json'

class Debug extends Component {
  render() {
    const { chain, session, sessions } = this.props;
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing></Table.HeaderCell>
            <Table.HeaderCell>Blockchain</Table.HeaderCell>
            <Table.HeaderCell>Account</Table.HeaderCell>
            <Table.HeaderCell>Permission</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        {(sessions.length)
          ? (
            <Table.Body>
              {sessions.map((s) => {
                const isCurrent = (
                  session
                  && session.auth
                  && s.auth.actor.equals(session.auth.actor)
                  && s.auth.permission.equals(session.auth.permission)
                  && s.chainId.equals(session.chainId)
                )
                const chain = find(blockchains, { chainId: String(s.chainId) })
                const key = Object.values(s.auth).join('-')
                return (
                  <Table.Row key={key}>
                    <Table.Cell collapsing>
                      <Button
                        color={isCurrent ? "blue" : "green"}
                        content={isCurrent ? "In Use" : "Use Account"}
                        disabled={isCurrent}
                        onClick={() => this.props.setSession(s)}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="center">{chain.name}</Table.Cell>
                    <Table.Cell>{String(s.auth.actor)}</Table.Cell>
                    <Table.Cell>{String(s.auth.permission)}</Table.Cell>
                    <Table.Cell collapsing>
                      <Button
                        color="red"
                        icon="trash"
                        onClick={() => this.props.removeSession(s)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          )
          : (
            <Table.Body>
              <Table.Row textAlign="center">
                <Table.Cell colSpan="4">No Accounts Imported</Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        }
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4" textAlign="right">
              <Button
                content="Add Account"
                icon="plus circle"
                onClick={this.props.addAccount}
                primary
              />
              {(sessions.length)
                ? (
                    <Button
                        color="red"
                        content="Logout All"
                        icon="trash"
                        onClick={() => this.props.clearSessions()}
                    />
                )
                : false
              }
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default Debug;
