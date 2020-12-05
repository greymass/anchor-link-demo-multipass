import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react';

class SigningError extends Component {
  render() {
    const { error } = this.props;
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
