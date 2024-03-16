const { ethers } = require("hardhat");

async function deploy() {
    const ServiceManager = await ethers.getContractFactory("ServiceManager");
    const servicerManager = await ServiceManager.deploy();

    console.log("Service Manager Address: ", servicerManager.address);
}

deploy()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.log("Deployment Error:", error);
        process.exit(1);
    });
