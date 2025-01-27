const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Farm Contract"),() => {

    let Factory;
    let factory;
    let TestToken;
    let rewardToken;
    let farm;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        //get test accounts
        [owner, user1, user2] = await ethers.getSigners();

        //deploy test token
        TestToken = await ethers.getContractFactory("TestToken");
        rewardToken = await TestToken.deploy();
        await rewardToken.waitForDeployment();

        //deploy lp token
        lpToken = await TestToken.deploy();
        await lpToken.waitForDeployment();

        //deploy Factory
        Factory = await ethers.getContractFactory("Farctoy");
        factory = await Factory.deploy();
        await factory.waitForDeployment();

        // through factory deploy farm
        const rewardPerSecond = ethers.parseEther("0.1");
        const startTime = Math.floor(Date.now() / 1000) + 120; // start in 2 minutes

        await factory.createFarm(
            await rewardToken.getAddress(),
            rewardPerSecond,
            startTime
        );

        //get farm address and connect to contract
        const farms = await factory.getAllFarms();
        const Farm = await ethers.getContractFactory("Farm");
        farm = Farm.attach(farms[0]);

        //transfer lp token to farm
        await lpToken.mint(await farm.getAddress(), ethers.parseEther("1000000")); 
    });

    describe("Basic Functions", function () {
        it("Should add pool correctly", async function () {
            await farm.addPool(await lpToken.getAddress(),100); //add pool with weight 100
            expect(await farm.poolLength().to.equal(1)); //check pool length is 1
    });

    it("Should allow deposit and track user balance", async function () {
        //add liquidity pool
        await farm.addPool(await lpToken.getAddress(),100);

        //give user1 some lp tokens
        await lpToken.transfer(user1.address, ethers.parseEther("100"));

        //allow farm contract use lp token
        await lpToken.connect(user1).approve(await farm.getAddress(), ethers.parseEther("100"));

        //deposit lp tokens to farm
        await farm.connect(user1).deposit(0, ethers.parseEther("50")); //deposit 50 lp tokens to pool 0
        expect(userInfo.amount).to.equal(ethers.parseEther("50"));
    });

    it("Should calculate and distribute rewards correctly", async function () {
        //add liquidity pool
        await farm.addPool(await lpToken.getAddress(),100);

        //give user1 some lp tokens and approve farm contract to use them
        await lpToken.transfer(user1.address, ethers.parseEther("100"));
        await lpToken.connect(user1).approve(await farm.getAddress(), ethers.parseEther("100"));

        //deposit lp tokens to farm
        await farm.connect(user1).deposit(0, ethers.parseEther("50")); //deposit 50 lp tokens to pool 0

        //wait for 10 minutes
        await ethers.provider.send("evm_increaseTime", [600]); //increase time by 10 minutes
        await ethers.provider.send("evm_mine"); //mine the block

        //check user1's reward balance
        const pendingReward = await farm.pendingReward(user1.address);
        expect(pendingReward).to.be.gt(0); //check user1 has pending reward
    });

    it("Should allow withdraw and track user balance", async function () {
        //add liquidity pool
        await farm.addPool(await lpToken.getAddress(),100);

        await lpToken.mint(user1.address, ethers.parseEther("100"));
      await lpToken.connect(user1).approve(await farm.getAddress(), ethers.parseEther("100"));
      
      // 存入LP代币
      await farm.connect(user1).deposit(0, ethers.parseEther("50"));
      
      // 提取LP代币
      await farm.connect(user1).withdraw(0, ethers.parseEther("50"));

      //Check user balance
      const userInfo = await farm.userInfo(0, user1.address);
      expect(userInfo.amount).to.equal(0); //Check user balance is 0
    });
});

describe("Security Features", function () {
    it("Should prevent rentrancy attack",async function () {
        await farm.addPool(await lpToken.getAddress(),100);
        await expect(
            farm.connect(user1).deposit(0, ethers.parseEther("50"))
        ).to.be.revertedWith("reentrancy-guard: reentrant call");
    });

    it("Should only allow owner to add pool", async function () {
        await expect(
            farm.connect(user1).addPool(await lpToken.getAddress(),100)
        ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });   
}