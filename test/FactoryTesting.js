const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Token contract", function () {

    async function deployTokenFixture() {
        const [deployer, user1, user2] = await ethers.getSigners();
        const coinsContract = await ethers.getContractFactory("Coins");
        const Coins = await coinsContract.deploy();
        await Coins.deployed();
        const factoryContract = await ethers.getContractFactory("ContractFactory");
        const Factory = await factoryContract.deploy(Coins.address);
        await Factory.deployed();
        return { Coins, Factory, deployer, user1, user2 };
    }

    it("should give information of roles", async function () {
        const { Factory } = await loadFixture(deployTokenFixture);
        const feeManager = await Factory.FEE_MANAGER();
        expect(await Factory.FEE_MANAGER()).to.equal(feeManager);
        const referalManager = await Factory.REFERAL_MANAGER();
        expect(await Factory.REFERAL_MANAGER()).to.equal(referalManager);
        expect(await Factory.getCurrentRole()).to.equal(await Factory.FEE_MANAGER());
    });

    it("should switch roles", async function () {
        const { Factory, user1 } = await loadFixture(deployTokenFixture);
        await Factory.switchRole();
        await Factory.switchRole();
        await Factory.switchRole();

        expect(await Factory.getCurrentRole()).to.equal(await Factory.REFERAL_MANAGER());
        await expect(Factory.connect(user1).switchRole()).to.be.revertedWith("you are not authorized to swith roles");
    });

    it("should give information of charges and decimals", async function () {
        const { Factory } = await loadFixture(deployTokenFixture);
        expect(await Factory.decimals()).to.equal(4);
        expect(await Factory.FEE_MANAGER_CHARGE()).to.equal(3);
        expect(await Factory.REFERAL_MANAGER_CHARGE()).to.equal(2);
    });

    it("should clone the implementation correctly", async function () {
        const { Factory, Coins, deployer, user1, user2} = await loadFixture(deployTokenFixture);
        expect(await Factory.getClone(1000, "Shiva", "SHIVA"));
        await Factory.switchRole();
        expect(await Factory.getClone(1000, "Shiva", "SHIVA"));
    });
});