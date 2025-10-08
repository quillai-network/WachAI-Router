import * as readline from "readline";
import dotenv from "dotenv";
dotenv.config();

import AcpClient, { AcpContractClient, AcpGraduationStatus, AcpJob, AcpJobPhases, AcpOnlineStatus } from "@virtuals-protocol/acp-node";

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function test() {
  try {
    const acpContractClient = await AcpContractClient.build(
      `0x${process.env.BUYER_PRIVATE_KEY}` as `0x${string}`,
      parseInt(process.env.BUYER_ENTITY_ID as string),
     '0x9D8583541eD4d4cde121053b00CFb021981b99fC' as `0x${string}`,
    );

    console.log("Starting ACP Client in Polling Mode");
    const acpClient = new AcpClient({
      acpContractClient,
    });

    console.log("Starting polling loop...");

    while (true) {
      try {
        console.log("Polling for active jobs...");
        const activeJobs = await acpClient.getActiveJobs();
        console.log(`Found ${activeJobs.length} active jobs`);

        // if no active jobs, browse for new agents
        if (activeJobs.length <5) {
          console.log("No active jobs found, browsing for new agents...");
          // Browse available agents based on a keyword and cluster name
          const relevantAgents = await acpClient.browseAgents(
            "Sentry:WachAI",
            {
              graduationStatus: AcpGraduationStatus.NOT_GRADUATED,
              onlineStatus: AcpOnlineStatus.ALL,
            }
          );
          console.log(`Found ${relevantAgents.length} relevant agents`);
          // console.log(relevantAgents)
          const relevantAgent = relevantAgents[0];
          const offerings = relevantAgent.offerings[0];
          console.log(offerings.name)
          console.log(`Creating job for agent ${relevantAgent.name}`);
          await offerings.initiateJob(
            {
              contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              chain: "ethereum"
            },
            process.env.BUYER_AGENT_WALLET_ADDRESS as `0x${string}`,
            //new Date(Date.now() + 1000 * 60 * 60 * 24) // expiredAt as last parameter
          );
          console.log(`Successfully created job for agent ${relevantAgent.name}`);

        }



        for (const job of activeJobs) {
          console.log(`Processing job ${job.id} in phase: ${AcpJobPhases[job.phase]}`);

          // skip some pending jobs
          if ([19215, 19211, 13982, 82030].includes(job.id)) {
            console.log(`Skipping job ${job.id} as it is pending`);
            continue;
          }
          if (job.phase === AcpJobPhases.REQUEST) {
            //console.log(job)
            console.log(`Skipping job ${job.id} as it is in request phase`);
            continue;
          }

          // Handle NEGOTIATION phase - pay for the job
          if (job.phase === AcpJobPhases.NEGOTIATION) {
            const memo = job.memos.find((m) => m.nextPhase === AcpJobPhases.TRANSACTION);
            if (memo) {
              console.log(`Paying for job ${job.id}: ${JSON.stringify(job.serviceRequirement)}`);
              await job.pay(0.01, "Payment for token due diligence report");
              console.log(`Successfully paid for job ${job.id}`);
            }
          }

          // Handle EVALUATION phase - evaluate the job
          if (job.phase === AcpJobPhases.EVALUATION && job.evaluatorAddress === process.env.BUYER_AGENT_WALLET_ADDRESS) {
            console.log(`Evaluating job ${job.id} with deliverable: ${JSON.stringify(job.deliverable)}`);
            console.log(`The response for the ${job.id}
              ${JSON.stringify(job.deliverable)}
            `)
            await job.evaluate(true, "This is a test reasoning - job completed successfully");
            console.log(`Successfully evaluated job ${job.id}`);
          }
        }

        // Sleep for 1 minute before next poll
        console.log("Sleeping for 60 seconds before next poll...");
        await new Promise(resolve => setTimeout(resolve, 60000));

      } catch (error) {
        console.error("Error in polling loop:", error);
        // Continue polling even if there's an error
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds before retry
      }
    }
  } catch (error) {
    console.error("Buyer polling failed:", error);
    // restart service
    console.log("Restarting polling service due to failure");
    test();
  }
}

test();