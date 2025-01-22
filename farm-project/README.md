# C2Nplus Farm Protocol  
**C2Nplus Farm Protocol** 是一个基于Solidity开发的去中心化农场（Farm）系统，支持LP代币质押和奖励分发功能。  
**C2Nplus Farm Protocol** is a decentralized farm system based on Solidity, supporting LP token staking and reward distribution.

## 功能特点  
**Features**  

- **多池子管理**：支持创建和管理多个LP代币质押池  
  **Multi-Pool Management**: Supports the creation and management of multiple LP token staking pools.

- **灵活的奖励机制**：基于时间和权重的奖励分配系统  
  **Flexible Reward Mechanism**: A reward distribution system based on time and weight.

- **安全保障**：  
  - 使用 OpenZeppelin 合约库  
    **Security Assurance**:  
    - Uses OpenZeppelin contract libraries.  
  - 实现重入攻击防护  
    - Implements reentrancy attack protection.  
  - 紧急提现功能  
    - Emergency withdrawal function.  
  - 可暂停机制  
    - Pausable mechanism.

## 合约架构  
**Contract Architecture**  

### Factory 合约  
**Factory Contract**  
- 负责创建和管理Farm合约实例  
  - Responsible for creating and managing Farm contract instances.  
- 维护所有已创建Farm的地址列表  
  - Maintains a list of all created Farm contract addresses.  
- 只有管理员可以创建新的Farm  
  - Only the administrator can create new Farms.

### Farm 合约  
**Farm Contract**  
- 管理LP代币的质押和提现  
  - Manages LP token staking and withdrawals.  
- 处理奖励代币的分发  
  - Handles reward token distribution.  
- 支持多池子配置和管理  
  - Supports multi-pool configuration and management.  
- 实现紧急提现机制  
  - Implements the emergency withdrawal mechanism.

## 主要功能  
**Main Features**  

### 用户操作  
**User Operations**  
- 质押LP代币（deposit）  
  - Stake LP tokens (deposit).  
- 提取LP代币（withdraw）  
  - Withdraw LP tokens (withdraw).  
- 紧急提现（emergencyWithdraw）  
  - Emergency withdrawal (emergencyWithdraw).  
- 查询待领取奖励（pendingReward）  
  - Check pending rewards (pendingReward).

### 管理员功能  
**Administrator Functions**  
- 添加新的LP池（addPool）  
  - Add new LP pool (addPool).  
- 更新分配权重（setAllocationPoint）  
  - Update allocation weight (setAllocationPoint).  
- 设置工厂地址（setFactoryAddress）  
  - Set factory address (setFactoryAddress).

## 技术特性  
**Technical Features**  

- **Solidity版本**: ^0.8.0  
  **Solidity Version**: ^0.8.0  
- **框架**: OpenZeppelin Contracts  
  **Framework**: OpenZeppelin Contracts  
- **安全特性**:  
  - ReentrancyGuard  
  - Pausable  
  - Ownable  
  **Security Features**:  
  - ReentrancyGuard  
  - Pausable  
  - Ownable

## 部署和使用  
**Deployment and Usage**  

1. 部署Factory合约  
   1. Deploy the Factory contract.  
2. 通过Factory创建Farm实例  
   2. Create Farm instances through the Factory.  
3. 配置Farm参数（添加池子、设置分配点数等）  
   3. Configure Farm parameters (add pools, set allocation points, etc.).  
4. 用户可以开始质押LP代币并获取奖励  
   4. Users can start staking LP tokens and receive rewards.

## 安全考虑  
**Security Considerations**  

- 所有关键功能都实现了重入攻击防护  
  - All critical functions have reentrancy attack protection.  
- 实现了紧急提现机制以应对异常情况  
  - An emergency withdrawal mechanism has been implemented for exceptional situations.  
- 管理员功能受权限控制保护  
  - Administrator functions are protected by permission control.  
- 代币转账使用安全转账机制  
  - Token transfers use secure transfer mechanisms.

## 许可证  
**License**  

MIT License  

