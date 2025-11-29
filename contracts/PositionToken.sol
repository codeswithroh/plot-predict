// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title PositionToken
/// @notice ERC1155 token representing YES/NO positions across all markets.
/// YES id = marketId * 2 + 1, NO id = marketId * 2 + 2
contract PositionToken is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string public name;
    string public symbol;

    constructor(string memory _name, string memory _symbol, string memory _uri) ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function idYes(uint256 marketId) public pure returns (uint256) {
        return marketId * 2 + 1;
    }

    function idNo(uint256 marketId) public pure returns (uint256) {
        return marketId * 2 + 2;
    }

    function mintYes(address to, uint256 marketId, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, idYes(marketId), amount, "");
    }

    function mintNo(address to, uint256 marketId, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, idNo(marketId), amount, "");
    }

    function burnYes(address from, uint256 marketId, uint256 amount) external onlyRole(MINTER_ROLE) {
        _burn(from, idYes(marketId), amount);
    }

    function burnNo(address from, uint256 marketId, uint256 amount) external onlyRole(MINTER_ROLE) {
        _burn(from, idNo(marketId), amount);
    }
}
