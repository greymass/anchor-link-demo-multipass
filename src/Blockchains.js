import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';

import eosLogo from './assets/eos.png';
import fioLogo from './assets/fio.svg';
import jungleLogo from './assets/jungle.png';
import protonLogo from './assets/proton.png';
import telosLogo from './assets/telos.png';
import waxLogo from './assets/wax.png';

import blockchains from './assets/blockchains.json';

const logoMap = {
  "0db13ab9b321c37c0ba8481cb4681c2788b622c3abfd1f12f0e5353d44ba6e72": eosLogo,
  "b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e": fioLogo,
  "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473": jungleLogo,
  "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840": jungleLogo,
  "71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd": protonLogo,
  "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f": telosLogo,
  "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12": waxLogo,
};

const options = blockchains.map((chain) => ({
  key: chain.chainId,
  text: chain.name,
  value: chain.chainId,
  image: {
    avatar: true,
    src: logoMap[chain.chainId]
  },
}));


class Blockchains extends Component {
  render() {
    const { chain } = this.props;
    return (
      <Dropdown
        fluid
        onChange={this.props.onChange}
        options={options}
        placeholder='Select Blockchain...'
        search
        selection
        value={chain.chainId}
      />
    );
  }
}

export default Blockchains;
