// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Farm.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Factory is Ownable {
    event FarmCreated(address indexed farm, address indexed rewardToken);

    address[] public farms; // 存储所有 Farm 合约地址的数组

    address public constant Ownerable = 0x0d87d8E1def9cA4A5f1BE181dc37c9ed9622c8d5; // 使用 public 和 constant 关键字

    constructor() Ownable(Ownerable) {
        // 初始化 Ownable 合约
    }

    function createFarm(
        IERC20 _rewardToken,
        uint256 _rewardPerSecond,
        uint256 _startTime
    ) external onlyOwner returns (address) {
        Farm farm = new Farm(
            _rewardToken,
            _rewardPerSecond,
            _startTime,
            address(this) // 这里是 Factory 合约的地址，成为 Farm 合约的所有者
        );
        
        farms.push(address(farm)); // 将新创建的 Farm 合约地址添加到 farms 数组中   
        emit FarmCreated(address(farm), address(_rewardToken)); // 触发 FarmCreated 事件
        return address(farm); // 返回新创建的 Farm 合约地址
    }

    function getAllFarms() external view returns (address[] memory) {
        return farms; // 返回所有 Farm 合约地址
    }
}