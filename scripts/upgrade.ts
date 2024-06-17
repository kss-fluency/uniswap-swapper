import {upgradeContract} from './utils';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const contractToUpgradeAddress = '0xd36F0b5Dc87C12B6132b6485740d3e6F5cB79596';
    await upgradeContract('UniswapSwapper', contractToUpgradeAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});