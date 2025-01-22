// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Farm is Ownable, ReentrancyGuard, Pausable {
    // 状态变量
    struct UserInfo {
        uint256 amount;         // LP代币数量
        uint256 rewardDebt;     // 已结算的奖励债务
        uint256 unlockTime;     // 解锁时间
    }

    struct PoolInfo {
        IERC20 lpToken;         // LP代币合约地址
        uint256 allocPoint;     // 分配权重
        uint256 lastRewardTime; // 最后更新奖励的时间
        uint256 accRewardPerShare; // 每份LP的累计奖励
    }

    IERC20 public rewardToken;  // 奖励代币
    uint256 public rewardPerSecond; // 每秒奖励数量
    uint256 public startTime;   // 开始时间
    uint256 public endTime;     // 结束时间
    address public factoryAddress; // 工厂合约地址

    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    uint256 public totalAllocPoint;

    // 事件
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Compound(address indexed user, uint256 indexed pid, uint256 amount);

    address public constant Ownerable = 0x0d87d8E1def9cA4A5f1BE181dc37c9ed9622c8d5; // 使用 public 和 constant 关键字

    constructor(
        IERC20 _rewardToken,
        uint256 _rewardPerSecond,
        uint256 _startTime,
        address _factoryAddress
    ) Ownable(Ownerable) {
        rewardToken = _rewardToken; // 奖励代币
        rewardPerSecond = _rewardPerSecond; // 每秒奖励数量
        startTime = _startTime; // 开始时间
        factoryAddress = _factoryAddress; // 工厂合约地址
    }

    // 设置工厂地址
    function setFactoryAddress(address _factoryAddress) external onlyOwner {
        factoryAddress = _factoryAddress;
    }

    // 添加新的LP池
    function addPool(IERC20 _lpToken, uint256 _allocPoint) external onlyOwner {
        _updateAllPools(); // 更新所有池子
        totalAllocPoint += _allocPoint; // 增加总分配点数
        poolInfo.push(PoolInfo({
            lpToken: _lpToken, // LP代币
            allocPoint: _allocPoint, // 分配权重
            lastRewardTime: block.timestamp, // 最后更新奖励的时间
            accRewardPerShare: 0 // 每份LP的累计奖励
        }));
    }

    // 更新分配点数
    function setAllocationPoint(uint256 _pid, uint256 _allocPoint) external onlyOwner {
        _updateAllPools(); // 更新所有池子  
        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint; // 更新总分配点数
        poolInfo[_pid].allocPoint = _allocPoint; // 更新池子的分配点数
    }

    // 存入LP代币
    function deposit(uint256 _pid, uint256 _amount) external nonReentrant whenNotPaused {
        PoolInfo storage pool = poolInfo[_pid]; // 获取池子信息
        UserInfo storage user = userInfo[_pid][msg.sender]; // 获取用户信息
        
        _updatePool(_pid); // 更新池子
        
        if (user.amount > 0) {
            uint256 pending = (user.amount * pool.accRewardPerShare / 1e12) - user.rewardDebt;
            if (pending > 0) {
                _safeRewardTransfer(msg.sender, pending); // 安全转移奖励
            }
        }
        
        if (_amount > 0) {
            pool.lpToken.transferFrom(msg.sender, address(this), _amount); // 从用户转移LP代币到合约
            user.amount += _amount; // 增加用户LP代币数量
        }
        
        user.rewardDebt = user.amount * pool.accRewardPerShare / 1e12; // 更新用户奖励债务
        emit Deposit(msg.sender, _pid, _amount); // 触发存款事件
    }

    // 提取LP代币
    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid]; // 获取池子信息
        UserInfo storage user = userInfo[_pid][msg.sender]; // 获取用户信息     
        require(user.amount >= _amount, "withdraw: insufficient balance"); // 检查用户LP代币数量是否足够
        require(block.timestamp >= user.unlockTime, "withdraw: tokens locked"); // 检查是否已解锁

        _updatePool(_pid);
        uint256 pending = (user.amount * pool.accRewardPerShare / 1e12) - user.rewardDebt; // 计算待领取的奖励
        
        if (pending > 0) {
            _safeRewardTransfer(msg.sender, pending); // 安全转移奖励
        }
        
        if (_amount > 0) {
            user.amount -= _amount; // 减少用户LP代币数量
            pool.lpToken.transfer(msg.sender, _amount); // 转移LP代币到用户
        }
        
        user.rewardDebt = user.amount * pool.accRewardPerShare / 1e12; // 更新用户奖励债务
        emit Withdraw(msg.sender, _pid, _amount); // 触发提取事件   
    }

    // 内部函数
    function _updatePool(uint256 _pid) internal {
        PoolInfo storage pool = poolInfo[_pid]; // 获取池子信息
        if (block.timestamp <= pool.lastRewardTime) {
            return;
        }

        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardTime = block.timestamp; // 更新池子最后更新奖励的时间
            return;
        }

        uint256 multiplier = block.timestamp - pool.lastRewardTime;
        uint256 reward = multiplier * rewardPerSecond * pool.allocPoint / totalAllocPoint;
        pool.accRewardPerShare += reward * 1e12 / lpSupply; // 更新池子每份LP的累计奖励
        pool.lastRewardTime = block.timestamp; // 更新池子最后更新奖励的时间
    }

    function _updateAllPools() internal {
        uint256 length = poolInfo.length; // 获取池子数量
        for (uint256 pid = 0; pid < length; ++pid) {
            _updatePool(pid); // 更新每个池子
        }
    }

    function _safeRewardTransfer(address _to, uint256 _amount) internal {
        uint256 rewardBal = rewardToken.balanceOf(address(this)); // 获取合约的奖励代币余额 
        if (_amount > rewardBal) {
            rewardToken.transfer(_to, rewardBal); // 转移所有奖励代币到目标地址
        } else {
            rewardToken.transfer(_to, _amount); // 转移指定数量的奖励代币到目标地址
        }
    }

    // 查询函数
    function poolLength() external view returns (uint256) {
        return poolInfo.length; // 获取池子数量
    }

    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accRewardPerShare = pool.accRewardPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this)); // 获取池子的LP代币余额

        if (block.timestamp > pool.lastRewardTime && lpSupply != 0) {
            uint256 multiplier = block.timestamp - pool.lastRewardTime;
            uint256 reward = multiplier * rewardPerSecond * pool.allocPoint / totalAllocPoint;
            accRewardPerShare += reward * 1e12 / lpSupply; // 更新池子每份LP的累计奖励
        }
        
        return (user.amount * accRewardPerShare / 1e12) - user.rewardDebt; // 计算待领取的奖励
    }

    // 紧急提取
    function emergencyWithdraw(uint256 _pid) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid]; // 获取池子信息
        UserInfo storage user = userInfo[_pid][msg.sender]; // 获取用户信息
            uint256 amount = user.amount; // 获取用户LP代币数量
        user.amount = 0; // 清空用户LP代币数量
        user.rewardDebt = 0; // 清空用户奖励债务
        pool.lpToken.transfer(msg.sender, amount); // 转移LP代币到用户
        emit EmergencyWithdraw(msg.sender, _pid, amount); // 触发紧急提取事件
    }
} 