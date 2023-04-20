# Sample Hardhat Project

This project demonstrates the implementation of Minimal Proxy, user can interact with `getClone` method,
and can get the addres of the new Clone.


Run project by following the steps below:

```shell
npx hardhat compile
```
To run test cases use command:
```shell
npx hardhat test
```
To deploy on hardhat local network use command:
```shell
npx hardhat run scripts/deploy.js
```
To deploy on testnet or mainnet use command:
```shell
npx hardhat run scripts/deploy.js --network <network name>
```
To deploy on network remember to save network url, api key, private key in .env file that will be exported in hardhat-config file.