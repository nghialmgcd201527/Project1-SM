// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Advisor is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;

    uint256 public constant totalAllocation = 40e6 * 1e18;
    uint256 public remainingAmount = 40e6 * 1e18;
    uint256 public constant eachDistributeAmount = (totalAllocation * 5) / 100;
    uint256 public nextTimeDistribute = block.timestamp + (47 * 30 days);
    uint256 public constant distributePeriod = 30 days;
    uint256 public lastTimeDistribute = block.timestamp + (48 * 30 days);

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
            block.timestamp >= nextTimeDistribute,
            "Please wait until release time"
        );
        uint256 amount = 0;
        if (block.timestamp >= lastTimeDistribute) {
            amount = remainingAmount;
        } else {
            if (eachDistributeAmount <= remainingAmount) {
                amount = eachDistributeAmount;
            } else {
                amount = remainingAmount;
            }
        }
        remainingAmount = remainingAmount - amount;
        nextTimeDistribute = nextTimeDistribute + distributePeriod;
        token.safeTransfer(msg.sender, amount);
        emit ReleaseAllocation(msg.sender, amount, remainingAmount);
    }
}
