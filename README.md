# C2Nplus Farm Protocol

C2Nplus Farm Protocol 是一个基于Solidity开发的去中心化农场（Farm）系统，支持LP代币质押和奖励分发功能。

## 功能特点

- 多池子管理：支持创建和管理多个LP代币质押池
- 灵活的奖励机制：基于时间和权重的奖励分配系统
- 安全保障：
  - 使用 OpenZeppelin 合约库
  - 实现重入攻击防护
  - 紧急提现功能
  - 可暂停机制

## 合约架构

### Factory 合约
- 负责创建和管理Farm合约实例
- 维护所有已创建Farm的地址列表
- 只有管理员可以创建新的Farm

### Farm 合约
- 管理LP代币的质押和提现
- 处理奖励代币的分发
- 支持多池子配置和管理
- 实现紧急提现机制

## 主要功能

### 用户操作
- 质押LP代币（deposit）
- 提取LP代币（withdraw）
- 紧急提现（emergencyWithdraw）
- 查询待领取奖励（pendingReward）

### 管理员功能
- 添加新的LP池（addPool）
- 更新分配权重（setAllocationPoint）
- 设置工厂地址（setFactoryAddress）

## 技术特性

- Solidity版本: ^0.8.0
- 框架: OpenZeppelin Contracts
- 安全特性:
  - ReentrancyGuard
  - Pausable
  - Ownable

## 部署和使用

1. 部署Factory合约
2. 通过Factory创建Farm实例
3. 配置Farm参数（添加池子、设置分配点数等）
4. 用户可以开始质押LP代币并获取奖励

## 安全考虑

- 所有关键功能都实现了重入攻击防护
- 实现了紧急提现机制以应对异常情况
- 管理员功能受权限控制保护
- 代币转账使用安全转账机制

## 许可证

MIT License
