const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("Token contract", function () {

    async function deployTokenFixture() {
        const [deployer, user1, user2] = await ethers.getSigners();
        const coinsContract = await ethers.getContractFactory("Coins");
        const Coins = await coinsContract.deploy();
        await Coins.deployed();
        return { Coins, deployer, user1, user2};
    }

    const zero_address = "0x0000000000000000000000000000000000000000";
    it("should initialize correctly", async function() {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(1000, "Shiva Token", "SHIVA");
        await expect(Coins.initialize(1000, "Shiva Token", "SHIVA")).to.be.revertedWith("Initializable: contract is already initialized");

    });

    it("should use transfer correctly", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(1000, "Shiva Token", "SHIVA");
        expect(await Coins.balanceOf(deployer.address)).to.equal(1000);
        expect(await Coins.transfer(user1.address, 100)).to.emit(Coins, "Transfer").withArgs(deployer.address, user1.address, 100);
        await expect(Coins.connect(user1).transfer(user2.address, 1000)).to.be.revertedWith("Insufficient amount");
        await expect(Coins.connect(user1).transfer(zero_address, 100)).to.be.revertedWith("can not send tokens to zero address");
    });

    it("should approve someone", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(1000, "Shiva Token", "SHIVA");
        expect(await Coins.allowance(deployer.address, user1.address)).to.equal(0);
        expect(await Coins.approve(user1.address, 100)).to.emit(Coins, "Approval").withArgs(deployer.address, user1.address, 100);
        await expect(Coins.approve(deployer.address, 100)).to.be.revertedWith("Can not approve Yourself");

    });

    it("should use transferFrom correctly", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        await Coins.approve(user1.address, 1000);
        await Coins.connect(user1).transferFrom(deployer.address, user2.address, 100);
        expect(await Coins.balanceOf(user2.address)).to.equal(100);
        expect(await Coins.connect(user1).transferFrom(deployer.address, user2.address, 100)).to.emit(Coins, "Transfer").withArgs(deployer.address, user2.address, 100);
        await expect(Coins.connect(user1).transferFrom(deployer.address, deployer.address, 100)).to.be.revertedWith("same from and to");
        await expect(Coins.connect(user1).transferFrom(deployer.address, user1.address, BigInt(Math.pow(10, 24)))).to.be.revertedWith("from does not have sufficient balance");
        await expect(Coins.connect(user1).transferFrom(deployer.address, user1.address, BigInt(Math.pow(10, 20)))).to.be.revertedWith("Not Authorized Or Insufficient Balance");
        await expect(Coins.connect(user1).transferFrom(zero_address, user1.address, BigInt(Math.pow(10, 20)))).to.be.revertedWith("can not transfer or send to zero address");
        await expect(Coins.connect(user1).transferFrom(deployer.address, zero_address, BigInt(Math.pow(10, 20)))).to.be.revertedWith("can not transfer or send to zero address");
    });

    it("should mint token correctly", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        await Coins.mint(user1.address, 100);
        expect(BigInt(await Coins.totalSupply())).to.equal(BigInt(Math.pow(10, 21)) + BigInt(100));
        expect(await Coins.mint(user1.address, 100)).to.emit(Coins, "Transfer").withArgs(0, user1.address, 100);
        await expect(Coins.connect(user1).mint(deployer.address, 100)).to.be.revertedWith("not authorized to mint");
        await expect(Coins.mint(zero_address, 100)).to.be.revertedWith("Cannot mint tokens to the zero address");
    });

    it("should burn token correctly", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");       
        await Coins.transfer(user1.address, 1000);
        await Coins.burn(user1.address, 100);
        const expectedTotalSupply = BigInt(Math.pow(10, 21)) - BigInt(100);
        expect(BigInt(await Coins.totalSupply())).to.equal(expectedTotalSupply);
        expect(await Coins.burn(user1.address, 100)).to.emit(Coins, "Transfer").withArgs(user1.address, 0, 100);
        await expect(Coins.connect(user1).burn(user1.address, 100)).to.be.revertedWith("not authorized to burn");
        await expect(Coins.burn(user1.address, 10000)).to.be.revertedWith("Not enough balance");
    });

    it("burnFrom should work correctly", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        await Coins.approve(user1.address, 1000);
        await Coins.connect(user1).burnFrom(deployer.address, 100);
        const expectedTotalSupply = BigInt(Math.pow(10, 21)) - BigInt(100);
        expect(BigInt(await Coins.totalSupply())).to.equal(expectedTotalSupply);
        expect(await Coins.connect(user1).burnFrom(deployer.address, 100)).to.emit(Coins, "Transfer").withArgs(deployer.address, 0, 100);
        await expect(Coins.connect(user1).burnFrom(deployer.address, 1000)).to.be.revertedWith("you are not approved or Low Approval Balance");
        await expect(Coins.connect(user1).burnFrom(zero_address, 10)).to.be.revertedWith("can not burn from zero address");
        await Coins.approve(user1.address, BigInt(Math.pow(10,24)));
        await expect(Coins.connect(user1).burnFrom(deployer.address, BigInt(Math.pow(10,24)))).to.be.revertedWith("Insufficient funds in from account");
    });

    it("should return total supply of token", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        expect(await Coins.totalSupply()).to.equal(BigInt(1000 * Math.pow(10, 18)));
    });

    it("should return balance of the account", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        expect(await Coins.balanceOf(deployer.address) / Math.pow(10, 18)).to.equal(1000);
    });

    it("should return name of the token", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        expect(await Coins.name()).to.equal("Shiva Token");
    });

    it("should return symbol of the token", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        expect(await Coins.symbol()).to.equal("SHIVA");
    });

    it("should return allowance correctly", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        await Coins.approve(user1.address, 100);
        expect(await Coins.allowance(deployer.address, user1.address)).to.equal(100);
    });

    it("should transfer ownership to other person", async function () {
        const { Coins, deployer, user1, user2 } = await loadFixture(deployTokenFixture);
        await Coins.initialize(BigInt(Math.pow(10,21)), "Shiva Token", "SHIVA");
        await Coins.transferOwnership(user1.address);
        expect(await Coins.balanceOf(user1.address)).to.equal(BigInt(Math.pow(10,21)));
        await expect(Coins.transferOwnership(user2.address)).to.be.revertedWith("you are not authorized to change owner");
    })
});