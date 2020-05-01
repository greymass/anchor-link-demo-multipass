### anchor-link-demo-multipass

This demo is a developer focused example to help show how Anchor + anchor-link can be used to create a multi-chain, multi-account, multi-device EOSIO applications. It was created using the create-react-app generic boilerplate and also includes anchor-link and anchor-link-browser-transport.

To run the demo, you'll just need to clone down this repository and run:

```
yarn install --frozen-lockfile
yarn start
```

The demo will launch in your browser in a local server.

You can also view this demo live at the following URL:

https://greymass.github.io/anchor-link-demo-multipass/

#### Documentation

The code itself is documented and the bulk of the implementation can be found inside `./src/App.js`. If you read through this code, you should be able to understand exactly how to instantiate anchor-link with the browser transport, and create ESR protocol requests.

#### Signature Provider Support

This demo has been confirmed to work with:

- Anchor Desktop (1.0.0): https://github.com/greymass/anchor
- Anchor Mobile (0.1.0): Unreleased, beta testing in progress.

It should work with any signature provider/wallet that integrates with the ESR Protocol specification.

#### Testnet Support

The current test networks are defined in `./src/assets/blockchain.json`. Additional networks can be enabled by adding new definitions to this file.

The logos for each network are also located in `./src/assets`, and are defined in `./src/Blockchains.js`.

#### Further reading

For more information about the technologies involved, please refer to:

- [ESR (EOSIO Signing Request, EEP-7) Specification](https://github.com/greymass/EEPs/blob/master/EEPS/eep-7.md)
- [greymass/anchor-link](https://github.com/greymass/anchor-link)
- [greymass/anchor-link-browser-transport](https://github.com/greymass/anchor-link-browser-transport)

#### Communications

Feel free to join us in telegram to discuss this or ask questions:

- https://t.me/anchor_link
