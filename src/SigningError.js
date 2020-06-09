import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react';
import ReactJson from 'react-json-view';

class SigningError extends Component {
  render() {
    const { error } = this.props;
    console.log(error)
    return (
      <Segment color="red" size="large">
        <Header size="large">
          Error while processing request
        </Header>
        {error.message}
      </Segment>
    );
  }
}

export default SigningError;
