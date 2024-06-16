import {deployProxyAndVerify} from './utils';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    await deployProxyAndVerify('UniswapSwapper', []);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});