const { ethers, run, network } = require("hardhat");


async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();
  console.log(`Deployed contraact to: ${(await simpleStorage.getAddress()).toString()}`);
  if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deploymentTransaction().wait(6);
    await verify((await simpleStorage.getAddress()).toString(), []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(20);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${updatedValue}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try{
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e){
    if(e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });