// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./PositionToken.sol";
import "./Market.sol";

/// @title MarketFactory
/// @notice Deploys and indexes markets; holds shared configuration
contract MarketFactory is AccessControl, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");

    PositionToken public immutable positionToken;

    // Protocol config
    address public treasury;
    uint256 public feeBps; // protocol fee in bps, taken from pool at resolution

    // Market registry
    uint256 public marketCounter;
    mapping(uint256 => address) public marketById;
    EnumerableSet.AddressSet private _markets;

    // Events
    event MarketCreated(uint256 indexed marketId, address indexed market, string question, uint256 lockTime);
    event ConfigUpdated(address treasury, uint256 feeBps);

    constructor(address _admin, address _treasury, uint256 _feeBps, string memory uri_) {
        require(_admin != address(0) && _treasury != address(0), "zero addr");
        require(_feeBps <= 2_000, "fee too high");
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(CONFIG_ROLE, _admin);
        treasury = _treasury;
        feeBps = _feeBps;
        positionToken = new PositionToken("PlotPredict Positions", "PPP", uri_);
    }

    // --- Admin config ---

    function setConfig(address _treasury, uint256 _feeBps) external onlyRole(CONFIG_ROLE) {
        require(_treasury != address(0), "zero addr");
        require(_feeBps <= 2_000, "fee too high");
        treasury = _treasury;
        feeBps = _feeBps;
        emit ConfigUpdated(_treasury, _feeBps);
    }

    // --- Market creation ---

    function createMarket(
        string calldata question,
        string calldata imageUrl,
        uint256 lockTime
    ) external onlyRole(CONFIG_ROLE) nonReentrant returns (address market) {
        marketCounter += 1;
        market = address(new Market({
            _marketId: marketCounter,
            _factory: address(this),
            _admin: msg.sender,
            _positionToken: IPositionToken(address(positionToken)),
            _treasury: treasury,
            _feeBps: feeBps,
            _question: question,
            _imageUrl: imageUrl,
            _lockTime: lockTime
        }));

        // Grant mint/burn rights to the market
        positionToken.grantRole(positionToken.MINTER_ROLE(), market);

        marketById[marketCounter] = market;
        _markets.add(market);

        emit MarketCreated(marketCounter, market, question, lockTime);
    }

    // --- Views ---

    function markets() external view returns (address[] memory list) {
        uint256 n = _markets.length();
        list = new address[](n);
        for (uint256 i = 0; i < n; i++) {
            list[i] = _markets.at(i);
        }
    }
}
