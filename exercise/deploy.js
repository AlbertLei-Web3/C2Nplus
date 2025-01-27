const hre = require("hardhat"); 

async function main() {
    const [deployer] = await ethers.getSigners(); // get the account of the deployer
    console.log("Deploying contracts with the account:", deployer.address);

    //deploy test rewardToken contract
    const TestToken = await hre.ethers.getContractFactory("TestToken"); // get the contract factory of the contract to be deployed
    const testToken = await TestToken.deploy(); // deploy the contract
    await testToken.waitForDeployment(); // wait for the deployment to be mined
    console.log("TestToken deployerd to:", testToken.address);

    //deploy Factory contract
    const Factory = await hre.ethers.getContractFactory("Factory"); // get the contract factory of the contract to be deployed
    const factory = await Factory.deploy();
    await factory.waitForDeployment(); // wait for the deployment to be mined
    console.log("Factory deployerd to:", factory.address);

    //use Factory contract to create Farm
    const rewardPerSecond = ethers.parseEther("0.1"); // set the reward per second
    const startTime = Math.floor(Date.now() / 1000) + 3600; // set the start time to 10 seconds from now

    const createFarmTx = await factory.createFarmTx(
        testToken.address,
        rewardPerSecond,
        startTime
    ); 
    await createFarmTx.wait(); // wait for the transaction to be mined

    //get address of the newly created Farm
    const farms = await factory.getAllFarms();
    console.log("Farm deployed to:", farms[0]);

    //verify the contract on Etherscan
    if (process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contracts...");
        await hre.run("verify:verify", {
            address: factoryAddress,
            constructorArguments: [],
        });

        await hre.run("verify:verify", {
        address: testTokenAddress,
        constructorArguments: [],
        });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });