const {ethers} = require("hardhat");

async function main() {
//   const ImplementationContract = await ethers.getContractFactory(
//     "Coins"
//   );
//   // deploy the implementation contract
//   const implementationContract = await ImplementationContract.deploy();
//   console.log("implementationContract contract is deploying........");
//   await implementationContract.deployed();

//   console.log("Implementation contract address is...:- ", implementationContract.address);

  const contractFactory = await ethers.getContractFactory(
    "ContractFactory"
  );

  // deploy the minimal factory contract
  console.log("ContractFactory contract is deploying........");

  const ContractFactory = await contractFactory.deploy("0x339ebf47BCF79c001A2D16c4d3f85e5f9cD98BAF");
  await ContractFactory.deployed();
  console.log("ContractFactory contract address is...:- ",ContractFactory.address);


  // call the deploy clone function on the minimal factory contract and pass parameters
//   const deployCloneContract = await minimalProxyFactory.deployClone(
//     implementationContract.address
//   );
//   deployCloneContract.wait();

  // get deployed proxy address
//   const ProxyAddress = await minimalProxyFactory.proxies(0);
//   console.log("Proxy contract ", ProxyAddress);

//   // load the clone
//   const proxy = await hre.ethers.getContractAt(
//     "ImplementationContract",
//     ProxyAddress
//   );

//   console.log("Proxy is initialized == ", await proxy.isInitialized()); // get initialized boolean == true
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});