// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Advisor is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;
    uint256 public constant totalSupply = 40e6 * 1e18;
    uint256 public constant totalAllocation = 40e6 * 1e18 * 0.02;
    uint256 public remainingAmount = (40e6 - (0.001 * 40e6)) * 1e18 * 0.02;
    uint256 public eachReleaseAmount = remainingAmount / 48;
    uint256 public nextTimeRelease = block.timestamp + 30 days;
    uint256 public constant releasePeriod = 30 days;
    uint256 public lastTimeRelease = block.timestamp + (47 * 30 days) + 30 days;

    event ReleaseAllocation(
        address indexed to,
        uint256 releaseAmount,
        uint256 remainingAmount
    );

    constructor(address _token) {
        token = IERC20(_token);
    }

    function balance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function release() external onlyOwner {
        require(remainingAmount > 0, "All tokens were released");
        require(
            block.timestamp >= nextTimeRelease,
            "Please wait until release time"
        );
        uint256 amount = 0;
        if (block.timestamp >= lastTimeRelease) {
            amount = remainingAmount;
        } else {
            if (eachReleaseAmount <= remainingAmount) {
                amount = eachReleaseAmount;
            } else {
                amount = remainingAmount;
            }
        }
        remainingAmount = remainingAmount - amount;
        nextTimeRelease = nextTimeRelease + releasePeriod;
        token.safeTransfer(msg.sender, amount);
        emit ReleaseAllocation(msg.sender, amount, remainingAmount);
    }
}
