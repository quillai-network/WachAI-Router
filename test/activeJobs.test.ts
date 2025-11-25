import dotenv from "dotenv";
import AcpClient, { AcpAgentSort, AcpContractClientV2 } from "@virtuals-protocol/acp-node";
import { AcpGraduationStatus } from "@virtuals-protocol/acp-node";
import { AcpOnlineStatus } from "@virtuals-protocol/acp-node";

dotenv.config();


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

    const browsedAgent = await acpClient.browseAgents("Sentry:WachAI", {
        top_k: 5,
        sort_by: [AcpAgentSort.SUCCESSFUL_JOB_COUNT],
        graduationStatus: AcpGraduationStatus.NOT_GRADUATED,
        onlineStatus: AcpOnlineStatus.ALL,
    });
    console.log(`Browsed agents: ${browsedAgent.length}`);
    browsedAgent.forEach(agent => {
        console.log(`Agent: ${agent.name}`);
    });
    console.log(`Found ${activeJobs.length} active jobs`);
}, 20000);
}

test();