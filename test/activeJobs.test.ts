import dotenv from "dotenv";
import AcpClient, { AcpContractClient, AcpContractClientV2 } from "@virtuals-protocol/acp-node";

dotenv.config();

console.log(process.env.PRIVATE_KEY);
console.log(process.env.ENTITY_ID);
console.log(process.env.AGENT_WALLET_ADDRESS);

async function test() {
    const acpClient = new AcpClient({
    acpContractClient: await AcpContractClientV2.build(
        `0x${process.env.PRIVATE_KEY}` as `0x${string}`,
        parseInt(process.env.ENTITY_ID as string),
        process.env.AGENT_WALLET_ADDRESS as `0x${string}`,
        //baseSepoliaAcpConfig
    ),
});


// get active jobs in every 20 seconds
setInterval(async () => {
    const activeJobs = await acpClient.getActiveJobs();
    console.log(`Found ${activeJobs.length} active jobs`);
}, 20000);
}

test();