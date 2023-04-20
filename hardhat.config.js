require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.19",
    networks: {
      sepolia: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_API_KEY}`,
        accounts: [process.env.NETWORK_PRIVATE_KEY]
      },
      goerli: {
        url: `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_API_KEY}`,
        accounts: [process.env.NETWORK_PRIVATE_KEY]
      },
      mainnet: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.MAINNET_API_KEY}`,
        accounts: [process.env.NETWORK_PRIVATE_KEY]
      }
    },
    etherscan: {
      apiKey: "Z1NGNIDYG42JMMSBWCC6V3G19EXBZSWFNQ"
    }
}

//imp-
//0x339ebf47BCF79c001A2D16c4d3f85e5f9cD98BAF
//clone-
//0x47FaF344E15D62572e5D67829Fe97214F17A4986
//clone new-
//0xdc996a7548410F2b78Fa3ddac50E42AD6915ccf7