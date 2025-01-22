import { ethers } from "hardhat";

async function main() {
  // 部署 Factory 合约
  const Factory = await ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();

  console.log("Factory deployed to:", await factory.getAddress());

  // 部署示例 Farm
  const rewardTokenAddress = "0x5c15514CA3B498510D0CEE0B505F1c603bB3324D"; // FHB1 作为奖励代币地址
  const rewardPerSecond = ethers.parseEther("0.00317"); // 设置每秒奖励数量
  const startTime = Math.floor(Date.now() / 1000) + 3600; // 设置开始时间为1小时后

  const tx = await factory.createFarm(
    rewardTokenAddress,
    rewardPerSecond,
    startTime
  );
  await tx.wait();

  console.log("First farm created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
