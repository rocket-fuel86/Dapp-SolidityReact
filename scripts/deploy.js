const {ethers} = require("hardhat");

const deploy = async()=>{
    const factory = await ethers.getContractFactory("MediaStore");
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log("Deployed at: ", await contract.getAddress());
}

deploy();