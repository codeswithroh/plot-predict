// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface IPositionToken is IERC1155, IERC1155MetadataURI {
    function idYes(uint256 marketId) external pure returns (uint256);
    function idNo(uint256 marketId) external pure returns (uint256);
    function mintYes(address to, uint256 marketId, uint256 amount) external;
    function mintNo(address to, uint256 marketId, uint256 amount) external;
    function burnYes(address from, uint256 marketId, uint256 amount) external;
    function burnNo(address from, uint256 marketId, uint256 amount) external;
}

/// @title Market
/// @notice A simple two-outcome (YES/NO) pari-mutuel market with native token escrow.
contract Market is Ownable, ReentrancyGuard {
    enum Outcome { Undecided, Yes, No }

    // Immutable config
    uint256 public immutable marketId;
    address public immutable factory;
    IPositionToken public immutable positionToken;
    address public immutable treasury;
    uint256 public immutable feeBps; // protocol fee in bps taken from total pool on resolution

    // Metadata
    string public question; // e.g., "Will character X die in episode Y?"
    string public imageUrl;
    uint256 public lockTime; // last time to place bets

    // State
    uint256 public totalYes;
    uint256 public totalNo;
    uint256 public totalPool;
    Outcome public outcome;
    bool public resolved;

    // Events
    event BetPlaced(address indexed user, uint8 indexed option, uint256 amount, uint256 shares);
    event MarketLocked(uint256 lockTime);
    event Resolved(Outcome outcome, uint256 feeAmount, uint256 rewardPool);
    event Claimed(address indexed user, uint256 amount, uint256 payout);

    modifier onlyFactory() {
        require(msg.sender == factory, "Not factory");
        _;
    }

    modifier beforeLock() {
        require(block.timestamp < lockTime, "Market locked");
        _;
    }

    constructor(
        uint256 _marketId,
        address _factory,
        address _admin,
        IPositionToken _positionToken,
        address _treasury,
        uint256 _feeBps,
        string memory _question,
        string memory _imageUrl,
        uint256 _lockTime
    ) Ownable(_admin) {
        require(_factory != address(0) && _treasury != address(0), "zero addr");
        require(_feeBps <= 2_000, "fee too high"); // cap at 20%
        require(_lockTime > block.timestamp, "lock in future");
        marketId = _marketId;
        factory = _factory;
        positionToken = _positionToken;
        treasury = _treasury;
        feeBps = _feeBps;
        question = _question;
        imageUrl = _imageUrl;
        lockTime = _lockTime;
        outcome = Outcome.Undecided;
    }

    // --- Betting ---

    function placeYes() external payable nonReentrant beforeLock {
        require(msg.value > 0, "zero value");
        totalYes += msg.value;
        totalPool += msg.value;
        positionToken.mintYes(msg.sender, marketId, msg.value);
        emit BetPlaced(msg.sender, 1, msg.value, msg.value);
    }

    function placeNo() external payable nonReentrant beforeLock {
        require(msg.value > 0, "zero value");
        totalNo += msg.value;
        totalPool += msg.value;
        positionToken.mintNo(msg.sender, marketId, msg.value);
        emit BetPlaced(msg.sender, 2, msg.value, msg.value);
    }

    // --- Admin ---

    function lockMarket() external onlyOwner {
        lockTime = block.timestamp;
        emit MarketLocked(lockTime);
    }

    function resolveYes() external onlyOwner {
        _resolve(Outcome.Yes);
    }

    function resolveNo() external onlyOwner {
        _resolve(Outcome.No);
    }

    function _resolve(Outcome _outcome) internal {
        require(!resolved, "resolved");
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "bad outcome");
        resolved = true;
        outcome = _outcome;
        uint256 fee = (totalPool * feeBps) / 10_000;
        if (fee > 0) {
            (bool ok, ) = payable(treasury).call{value: fee}("");
            require(ok, "fee transfer");
        }
        uint256 rewardPool = totalPool - fee;
        emit Resolved(_outcome, fee, rewardPool);
    }

    // --- Claims ---

    function claim() external nonReentrant {
        require(resolved, "not resolved");
        uint256 userShares;
        uint256 winningShares;
        if (outcome == Outcome.Yes) {
            userShares = _balanceYes(msg.sender);
            winningShares = totalYes;
            require(userShares > 0, "no win");
            positionToken.burnYes(msg.sender, marketId, userShares);
        } else {
            userShares = _balanceNo(msg.sender);
            winningShares = totalNo;
            require(userShares > 0, "no win");
            positionToken.burnNo(msg.sender, marketId, userShares);
        }
        uint256 rewardPool = totalPool - ((totalPool * feeBps) / 10_000);
        uint256 payout = (rewardPool * userShares) / winningShares;
        (bool ok, ) = payable(msg.sender).call{value: payout}("");
        require(ok, "payout failed");
        emit Claimed(msg.sender, userShares, payout);
    }

    function _balanceYes(address user) internal view returns (uint256) {
        return positionToken.balanceOf(user, positionToken.idYes(marketId));
    }

    function _balanceNo(address user) internal view returns (uint256) {
        return positionToken.balanceOf(user, positionToken.idNo(marketId));
    }

    // View helpers
    function getInfo() external view returns (
        uint256 _id,
        string memory _question,
        string memory _imageUrl,
        uint256 _lockTime,
        uint256 _totalYes,
        uint256 _totalNo,
        uint256 _totalPool,
        bool _resolved,
        Outcome _outcome
    ) {
        return (
            marketId,
            question,
            imageUrl,
            lockTime,
            totalYes,
            totalNo,
            totalPool,
            resolved,
            outcome
        );
    }

    receive() external payable {}
}
