//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ERC20.sol";

contract ContractFactory is ReentrancyGuard {
    bytes32 public constant FEE_MANAGER = keccak256("Fee_Manager");
    bytes32 public constant REFERAL_MANAGER = keccak256("Referal_Manager");
    bytes32 private currentRole = FEE_MANAGER;
    address private immutable ERC20ADDRESS;
    address private owner;
    address public addressGenerated;
    uint8 public constant FEE_MANAGER_CHARGE = 3;
    uint8 public constant REFERAL_MANAGER_CHARGE = 2;
    uint8 public decimals = 4;
    using Clones for address;

    constructor(address _ERC20Address) {
        ERC20ADDRESS = _ERC20Address;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not authorized to swith roles");
        _;
    }

    function switchRole() external onlyOwner {
        if (currentRole == FEE_MANAGER) {
            currentRole = REFERAL_MANAGER;
        } else {
            currentRole = FEE_MANAGER;
        }
    }

    function getCurrentRole() external view returns (bytes32) {
        return currentRole;
    }

    function getClone(
        uint256 _totalSupply,
        string calldata _name,
        string calldata _symbol
    ) external {
        addressGenerated = ERC20ADDRESS.clone();
        Coins(addressGenerated).initialize(_totalSupply, _name, _symbol);
        if (currentRole == FEE_MANAGER) {
            Coins(addressGenerated).transfer(
                owner,
                ((_totalSupply) * (FEE_MANAGER_CHARGE)) / 10 ** (decimals)
            );
        } else {
            Coins(addressGenerated).transfer(
                owner,
                ((_totalSupply) * (REFERAL_MANAGER_CHARGE)) / 10 ** (decimals)
            );
        }
        Coins(addressGenerated).transferOwnership(msg.sender);
    }
}
