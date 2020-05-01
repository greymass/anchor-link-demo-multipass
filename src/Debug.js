import React, { Component } from 'react'
import { Table } from 'semantic-ui-react';

class Debug extends Component {
  render() {
    const { chainId, session } = this.props;
    return (

      <Table definition>
        <Table.Header>
          <Table.HeaderCell />
          <Table.HeaderCell>Currently Active Account</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              Chain ID
            </Table.Cell>
            <Table.Cell>
              {chainId}
            </Table.Cell>
          </Table.Row>
          {(session)
            ? (
              <React.Fragment>
                <Table.Row>
                  <Table.Cell>
                    Account
                  </Table.Cell>
                  <Table.Cell>
                    {session.auth.actor}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Permission
                  </Table.Cell>
                  <Table.Cell>
                    {session.auth.permission}
                  </Table.Cell>
                </Table.Row>
              </React.Fragment>
            )
            : false
          }
        </Table.Body>
      </Table>
    );
  }
}

export default Debug;
