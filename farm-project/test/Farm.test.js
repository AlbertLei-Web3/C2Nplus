const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Farm Contract", function () {
  let Factory;
  let factory;
  let TestToken;
  let rewardToken;
  let lpToken;
  let farm;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // 获取测试账户
    [owner, user1, user2] = await ethers.getSigners();

    // 部署测试代币（奖励代币）
    TestToken = await ethers.getContractFactory("TestToken");
    rewardToken = await TestToken.deploy();
    await rewardToken.waitForDeployment();

    // 部署LP代币（用于质押的代币）
    lpToken = await TestToken.deploy();
    await lpToken.waitForDeployment();

    // 部署Factory
    Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();
    await factory.waitForDeployment();

    // 通过Factory创建Farm
    const rewardPerSecond = ethers.parseEther("0.1");
    const startTime = Math.floor(Date.now() / 1000);
    
    await factory.createFarm(
      await rewardToken.getAddress(),
      rewardPerSecond,
      startTime
    );

    // 获取创建的Farm地址并连接到合约
    const farms = await factory.getAllFarms();
    const Farm = await ethers.getContractFactory("Farm");
    farm = Farm.attach(farms[0]);

    // 向Farm合约转入奖励代币
    await rewardToken.mint(await farm.getAddress(), ethers.parseEther("1000000"));
  });

  describe("Basic Functions", function () {
    it("Should add pool correctly", async function () {
      await farm.addPool(await lpToken.getAddress(), 100);
      expect(await farm.poolLength()).to.equal(1);
    });

    it("Should allow deposits and track user balance", async function () {
      // 添加流动性池
      await farm.addPool(await lpToken.getAddress(), 100);
      
      // 给用户一些LP代币
      await lpToken.mint(user1.address, ethers.parseEther("100"));
      
      // 授权Farm合约使用LP代币
      await lpToken.connect(user1).approve(await farm.getAddress(), ethers.parseEther("100"));
      
      // 存入LP代币
      await farm.connect(user1).deposit(0, ethers.parseEther("50"));
      
      // 检查用户余额
      const userInfo = await farm.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(ethers.parseEther("50"));
    });

    it("Should calculate and distribute rewards correctly", async function () {
      // 添加流动性池
      await farm.addPool(await lpToken.getAddress(), 100);
      
      // 给用户LP代币并授权
      await lpToken.mint(user1.address, ethers.parseEther("100"));
      await lpToken.connect(user1).approve(await farm.getAddress(), ethers.parseEther("100"));
      
      // 存入LP代币
      await farm.connect(user1).deposit(0, ethers.parseEther("50"));
      
      // 等待一段时间
      await ethers.provider.send("evm_increaseTime", [3600]); // 增加1小时
      await ethers.provider.send("evm_mine");
      
      // 检查待领取的奖励
      const pendingReward = await farm.pendingReward(0, user1.address);
      expect(pendingReward).to.be.gt(0);
    });

    it("Should allow withdrawal", async function () {
      // 添加流动性池
      await farm.addPool(await lpToken.getAddress(), 100);
      
      // 给用户LP代币并授权
      await lpToken.mint(user1.address, ethers.parseEther("100"));
      await lpToken.connect(user1).approve(await farm.getAddress(), ethers.parseEther("100"));
      
      // 存入LP代币
      await farm.connect(user1).deposit(0, ethers.parseEther("50"));
      
      // 提取LP代币
      await farm.connect(user1).withdraw(0, ethers.parseEther("50"));
      
      // 检查用户余额
      const userInfo = await farm.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(0);
    });
  });

  describe("Security Features", function () {
    it("Should prevent reentrancy attacks", async function () {
      await farm.addPool(await lpToken.getAddress(), 100);
      await expect(
        farm.connect(user1).deposit(0, ethers.parseEther("50"))
      ).to.be.revertedWith("ReentrancyGuard: reentrant call");
    });

    it("Should only allow owner to add pools", async function () {
      await expect(
        farm.connect(user1).addPool(await lpToken.getAddress(), 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});