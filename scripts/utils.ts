import {Contract, Signer} from "ethers";
import {DeployProxyOptions, UpgradeProxyOptions} from "@openzeppelin/hardhat-upgrades/dist/utils";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import hre, {ethers, upgrades} from "hardhat";
import {env} from "process";
import * as dotenv from 'dotenv';
import readline from "readline";
dotenv.config();

async function deployProxy<Type extends Contract>(
    contractName: string,
    parameters: any[],
    signer: Signer,
    opts?: DeployProxyOptions
): Promise<Type> {
    const contractFactory = await ethers.getContractFactory(contractName, signer);
    const contract = await upgrades.deployProxy(contractFactory, parameters, opts);
    await contract.waitForDeployment();

    return <Type>contract;
}

async function deployProxyAndVerify(
    contractName: string,
    params: any[],
    opts?: DeployProxyOptions
) {
    console.log(
        `Running ${contractName} deployment script on network ${hre.network.name} (chainId: ${hre.network.config.chainId})`
    );

    const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
    const deployer = new ethers.Wallet(env.SEPOLIA_WALLET_PRIVATE_KEY as string, provider);

    console.log(`\nDeployer address: ${deployer.address}`);
    console.log('\nParameters: ' + JSON.stringify(params));


    if (await confirm('\nDo you want to continue? [y/N] ')) {
        console.log(`Deploying ${contractName} contract...`);

        const contract = await deployProxy(contractName, params, deployer, opts);

        console.log(`${contractName} deployed to ${await contract.getAddress()}`);

        if (await confirmYesOrNo('\nDo you want to verify contract? [y/n] ')) {
            const implementationAddress = await getImplementationAddress(ethers.provider, await contract.getAddress());
            console.log('Implementation address: ', implementationAddress);
            await verifyContract(implementationAddress);
        }
    }
}

async function upgradeContract<Type extends Contract>(
    contractName: string,
    proxyAddress: string,
    options?: UpgradeProxyOptions
) {
    console.log(
        `Running ${contractName} upgrade script on network ${hre.network.name} (chainId: ${hre.network.config.chainId})`
    );

    const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
    const deployer = new ethers.Wallet(env.SEPOLIA_WALLET_PRIVATE_KEY as string, provider);

    const contractFactory = await ethers.getContractFactory(contractName, deployer);
    await upgrades.validateUpgrade(proxyAddress, contractFactory);
    const contract = await upgrades.upgradeProxy(proxyAddress, contractFactory, options);
    await contract.waitForDeployment();

    console.log(`${contractName} upgraded at ${await contract.getAddress()}`);

    if (await confirmYesOrNo('\nDo you want to verify contract? [y/n] ')) {
        const implementationAddress = await getImplementationAddress(ethers.provider, await contract.getAddress());
        console.log('Implementation address: ', implementationAddress);
        await verifyContract(implementationAddress);
    }

    return <Type>contract;
}

async function confirm(question: string): Promise<boolean> {
    const answer = await ask(question);
    return ['y', 'yes'].includes(answer.trim().toLowerCase());
}

async function confirmYesOrNo(
    question: string,
    yes: string[] = ['y', 'yes'],
    no: string[] = ['n', 'no']
): Promise<boolean> {
    while (true) {
        const answer = await ask(question);
        if (yes.includes(answer.trim().toLowerCase())) {
            return true;
        } else if (no.includes(answer.trim().toLowerCase())) {
            return false;
        }
        console.log(`Wrong answer. Possible options: ${[yes.join(', '), no.join(', ')].join(', ')}`);
    }
}

function ask(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) =>
        rl.question(question, (answer: string) => {
            rl.close();
            resolve(answer);
        })
    );
}

async function verifyContract(address: string, constructorArguments: any[] = []) {
    await hre.run('verify:verify', {
        address,
        constructorArguments
    });
}

export { deployProxy, deployProxyAndVerify, upgradeContract };