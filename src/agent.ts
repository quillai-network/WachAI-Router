import { createAgentResponseForACP } from "./helpers/agent";
import AcpClient, { AcpContractClient, AcpGraduationStatus, AcpJob, AcpJobPhases, AcpOnlineStatus } from "@virtuals-protocol/acp-node";
import dotenv from "dotenv";
import {
    getJobStage,
    setJobStage,
    addJobMapping,
    getJobMappingByOriginal,
    getJobMappingByRouted,
    loadAllJobMappings
} from "./helpers/redis";

dotenv.config();

const agent_offering_mapping = {
    verify_contract: "Sentry:wachAI",
    verify_token: "TokenSense:wachAI",
}

interface HybridJobStage {
    original_job_id?: number;
    routed_job_id?: number;
    routed_to_agent?: string;
    target_agent_name?: string;
    target_agent_address?: string;
    job_phase?: string;
    responded_to_request?: boolean;
    delivered_work?: boolean;
}

// Cache for agents to avoid repeated lookups
let agentCache: { [key: string]: any } = {};
let acpClient: AcpClient | null = null;

// Initialize ACP client and cache agents
async function initializeAcpClient() {
    try {
        if (acpClient) return acpClient;

        acpClient = new AcpClient({
            acpContractClient: await AcpContractClient.build(
                `0x${process.env.PRIVATE_KEY}` as `0x${string}`,
                parseInt(process.env.ENTITY_ID as string),
                process.env.AGENT_WALLET_ADDRESS as `0x${string}`,
                //baseSepoliaAcpConfig
            ),
        });

        // Cache agents for better performance
        const [browseSentry, browseTokenSense] = await Promise.all([
            acpClient.browseAgents("Sentry:wachAI", {
                graduationStatus: AcpGraduationStatus.NOT_GRADUATED,
                onlineStatus: AcpOnlineStatus.ALL,
            }),
            acpClient.browseAgents("TokenSense:wachAI", {
                graduationStatus: AcpGraduationStatus.NOT_GRADUATED,
                onlineStatus: AcpOnlineStatus.ALL,
            })
        ]);

        agentCache = {
            "Sentry:wachAI": browseSentry[0],
            "TokenSense:wachAI": browseTokenSense[0]
        };

        console.log(`ACP Client initialized for router agent: ${process.env.AGENT_WALLET_ADDRESS}`);
        return acpClient;
    } catch (error) {
        console.error("Error initializing ACP client:", error);
        throw error; // Re-throw to be handled by caller
    }
}

// Optimized job processing with better error handling
async function processJob(acpClient: AcpClient, activeJob: any, role: string) {
    const jobId = activeJob.id;

    try {
        let originalJobId = jobId;
        if (role === "consumer") {
            const originalJob = await getJobMappingByRouted(jobId)
            originalJobId = originalJob?.original_job_id;
            if (!originalJobId) {
                console.log(`No original job id found for routed job ${jobId}`);
                return;
            }
            console.log(`Original job id: ${originalJobId} FROM routed job ${jobId}`);
        }

        // Get job details and stages in parallel
        const [job, jobStages] = await Promise.all([
            acpClient.getJobById(jobId),
            getJobStage(String(originalJobId))
        ]);

        if (!job) {
            console.log(`Job ${jobId} not found`);
            return;
        }

        // Skip completed or rejected jobs
        if (job.phase === AcpJobPhases.COMPLETED || job.phase === AcpJobPhases.REJECTED) {
            console.log(`Skipping job ${jobId} as it is in phase: ${AcpJobPhases[job.phase]}`);
            return;
        }

        // Skip if already completed
        if (jobStages.responded_to_request && jobStages.delivered_work) {
            console.log(`Skipping job ${jobId} as it is already completed`);
            return;
        }

        console.log(`Processing job ${jobId} in phase: ${AcpJobPhases[job.phase]} as ${role}`);

        // Process based on phase
        switch (job.phase) {
            case AcpJobPhases.REQUEST:
                await handleRequestPhase(acpClient, job, jobStages, role);
                break;
            case AcpJobPhases.NEGOTIATION:
                await handleNegotiationPhase(acpClient, job, jobStages, role);
                break;
            case AcpJobPhases.TRANSACTION:
                await handleTransactionPhase(acpClient, job, jobStages, role);
                break;
            case AcpJobPhases.EVALUATION:
                await handleEvaluationPhase(acpClient, job, jobStages, role);
                break;
        }

        // Save job stages after processing
        await setJobStage(String(originalJobId), jobStages);

    } catch (error) {
        console.error(`Error processing job ${jobId}:`, error);
    }
}

// Handle REQUEST phase
async function handleRequestPhase(acpClient: AcpClient, job: AcpJob, jobStages: HybridJobStage, role: string) {
    try {
        if (role === "consumer") {
            console.log(`Skipping job ${job.id} in REQUEST PHASE as consumer`);
            return;
        }

        if (jobStages.job_phase === "ROUTED") {
            console.log(`Skipping job ${job.id} in REQUEST PHASE as agent has already routed to the target agent`);
            return;
        }

        if (!job.requirement) {
            console.log(`Job ${job.id} has no service requirement`);
            return;
        }
        else {
            console.log(`Processing job ${job.id} with name: ${job.name}`);
        }

        console.log(`Responding to job request ${job.id}: ${JSON.stringify(job.requirement)}`);

        const requirements = job.requirement || "no requirements";
        const jobDescription = {
            service: job.name,
            requirements: requirements,
        }
        console.log(`Job description: ${JSON.stringify(jobDescription)}`);
        const { offering, message } = await createAgentResponseForACP(JSON.stringify(jobDescription) as string);

        if (!offering) {
            console.log('Rejecting job as agent is not able to provide the service', message);
            await job.respond(false, message as string);
            jobStages.job_phase = "REJECTED";
            return;
        }
        console.log(`I'm choosing this offering: ${offering} because ${message}`);
        // Route to appropriate agent
        const agent_name = agent_offering_mapping[offering as keyof typeof agent_offering_mapping];
        console.log(`Routing job to ${agent_name}`);

        const targetAgent = agentCache[agent_name];
        if (!targetAgent) {
            console.log(`Target agent ${agent_name} not found`);
            await job.respond(false, "Target agent not available");
            jobStages.job_phase = "REJECTED";
            return;
        }

        try {
            const _offering = targetAgent.offerings[0];
            console.log(`Target offering: ${_offering.name}:${targetAgent.name}, Requirements: ${requirements}`);
            if (!_offering) {
                console.log(`No offerings found for target agent ${agent_name}`);
                await job.respond(false, "Target agent has no offerings");
                jobStages.job_phase = "REJECTED";
                return;
            }
            const routedJobId = await _offering.initiateJob(
                requirements,
                process.env.AGENT_WALLET_ADDRESS as `0x${string}`,
                new Date(Date.now() + 1800 * 1000)
            );

            console.log(`Created routed job ${routedJobId} to ${agent_name}`);

            // Update job stages and persist mapping
            jobStages.original_job_id = job.id;
            jobStages.routed_to_agent = agent_name;
            jobStages.routed_job_id = routedJobId;
            jobStages.target_agent_name = agent_name;
            jobStages.target_agent_address = targetAgent.walletAddress;
            jobStages.job_phase = "ROUTED";

            // Persist job mapping to Redis
            await addJobMapping(job.id, routedJobId);

        } catch (routingError) {
            console.error(`Error creating routed job:`, routingError);
            await job.respond(false, "Failed to route job to target agent");
            jobStages.job_phase = "REJECTED";
        }
    } catch (error) {
        console.error(`Error in handleRequestPhase for job ${job.id}:`, error);
        try {
            await job.respond(false, "Internal error processing request");
            jobStages.job_phase = "REJECTED";
        } catch (respondError) {
            console.error(`Failed to send error response for job ${job.id}:`, respondError);
        }
    }
}

// Handle NEGOTIATION phase
async function handleNegotiationPhase(acpClient: AcpClient, job: AcpJob, jobStages: HybridJobStage, role: string) {
    try {
        if (role === "provider") {
            console.log(`Skipping job ${job.id} in NEGOTIATION PHASE as provider`);
            return;
        }

        if (jobStages.job_phase === "REJECTED" || jobStages.job_phase === "ACCEPTED") {
            console.log(`Skipping job ${job.id} in NEGOTIATION PHASE as agent already responded`);
            return;
        }

        // Get original job mapping from Redis
        const mapping = await getJobMappingByRouted(job.id);
        if (!mapping) {
            console.log(`No mapping found for routed job ${job.id}`);
            return;
        }

        const originalJob = await acpClient.getJobById(mapping.original_job_id);
        if (!originalJob) {
            console.log(`Original job ${mapping.original_job_id} not found`);
            return;
        }

        if (originalJob.phase !== AcpJobPhases.REQUEST) {
            console.log(`Original job ${mapping.original_job_id} is not in REQUEST phase`);
            return;
        }

        await originalJob.respond(true, "I am accepting the job, I can provide the service");
        console.log(`Job ${job.id} is accepted`);
        jobStages.job_phase = "ACCEPTED";
    } catch (error) {
        console.error(`Error in handleNegotiationPhase for job ${job.id}:`, error);
        // Don't crash, just log and continue
    }
}

// Handle TRANSACTION phase
async function handleTransactionPhase(acpClient: AcpClient, job: AcpJob, jobStages: HybridJobStage, role: string) {
    try {
        if (role === "consumer") {
            console.log(`Skipping job ${job.id} in TRANSACTION PHASE as consumer`);
            return;
        }

        if (jobStages.job_phase === "PAID") {
            // check if request fullfilled
            console.log(`Checking if request is fullfilled for job ${job.id}`);
            const routedJob = await acpClient.getJobById(jobStages.routed_job_id as number);

            if (routedJob && routedJob.phase === AcpJobPhases.COMPLETED) {
                console.log(`Routed job ${job.id} is completed, delivering the deliverable`);
                console.log(JSON.stringify(routedJob.deliverable));
                const deliverable = {
                    type: "text",
                    value: JSON.parse(routedJob.deliverable as string).value || "No deliverable",
                };

                // Mark routed job as completed and deliver original job
                await job.deliver(deliverable);
                //await job.evaluate(true, "job completed successfully");
                jobStages.job_phase = "COMPLETED";
                jobStages.responded_to_request = true;
                jobStages.delivered_work = true;
                console.log(`Job ${job.id} is completed`);
            }
            return;
        }

        if (jobStages.job_phase !== "ACCEPTED") {
            console.log(`Job stages: ${JSON.stringify(jobStages)}`);
            console.log(`Skipping job ${job.id} in TRANSACTION PHASE as job not accepted`);
            return;
        }


        // Get routed job mapping from Redis
        const mapping = await getJobMappingByOriginal(job.id);
        if (!mapping) {
            console.log(`Routed job id not found for original job ${job.id}`);
            return;
        }

        const routedJob = await acpClient.getJobById(mapping.routed_job_id);
        if (!routedJob) {
            console.log(`Routed job ${mapping.routed_job_id} not found`);
            return;
        }

        if (routedJob.phase !== AcpJobPhases.NEGOTIATION) {
            console.log(`Skipping job ${job.id} in TRANSACTION PHASE as routed job is not in NEGOTIATION phase`);
            return;
        }

        console.log(`Paying for job ${job.id} and routing to target agent`);
        const memo = routedJob.memos.find((m) => m.nextPhase === AcpJobPhases.TRANSACTION);

        if (memo) {
            console.log(`Paying for job ${mapping.routed_job_id}: ${JSON.stringify(routedJob.requirement)}`);
            await routedJob.pay("Payment for fullfilling the job");
            console.log(`Successfully paid for job ${mapping.routed_job_id}`);
            jobStages.job_phase = "PAID";
        } else {
            console.log(`No memo found for job ${mapping.routed_job_id}`);
        }
    } catch (error) {
        console.error(`Error in handleTransactionPhase for job ${job.id}:`, error);
        // Don't crash, just log and continue
    }
}

// Handle EVALUATION phase
async function handleEvaluationPhase(acpClient: AcpClient, job: AcpJob, jobStages: HybridJobStage, role: string) {
    try {
        if (role === "provider") {
            console.log(`Skipping job ${job.id} in EVALUATION PHASE as provider`);
            return;
        }

        if (jobStages.job_phase !== "PAID") {
            console.log(`Skipping job ${job.id} in EVALUATION PHASE as job not paid`);
            return;
        }

        // Get original job mapping from Redis
        const mapping = await getJobMappingByRouted(job.id);
        if (!mapping) {
            console.log(`No mapping found for routed job ${job.id}`);
            return;
        }

        const originalJob = await acpClient.getJobById(mapping.original_job_id);
        if (originalJob?.phase === AcpJobPhases.COMPLETED) {
            console.log(`Original job ${mapping.original_job_id} is already completed`);
            return;
        }
        if (!originalJob) {
            console.log(`Original job ${mapping.original_job_id} not found`);
            return;
        }

        const deliverable = {
            type: "text",
            value: job.deliverable || "No deliverable",
        };

        // Mark routed job as completed and deliver original job
        await originalJob.deliver(deliverable);
        await job.evaluate(true, "job completed successfully");
        jobStages.job_phase = "COMPLETED";
        jobStages.responded_to_request = true;
        jobStages.delivered_work = true;
    } catch (error) {
        console.error(`Error in handleEvaluationPhase for job ${job.id}:`, error);
        // Don't crash, just log and continue
    }
}

// Optimized main job handler
async function handleAcpJobs() {
    try {
        const acpClient = await initializeAcpClient();

        // Load existing job mappings from Redis on startup
        const existingMappings = await loadAllJobMappings();
        console.log(`Loaded ${existingMappings.length} existing job mappings from Redis`);

        const pollingInterval = parseInt(process.env.POLLING_INTERVAL || "60000");

        while (true) {
            try {
                console.log("Polling for active jobs...");
                const activeJobs = await acpClient.getActiveJobs();
                if (!activeJobs?.length) {
                    console.log("No active jobs found");
                    await new Promise(resolve => setTimeout(resolve, pollingInterval));
                    continue;
                }

                // Process jobs in parallel for better performance
                const jobPromises = activeJobs.map(async (activeJob) => {
                    const jobId = activeJob.id;
                    let role: string;

                    // Determine role
                    if (activeJob.providerAddress === process.env.AGENT_WALLET_ADDRESS) {
                        role = "provider";
                    } else if (activeJob.clientAddress === process.env.AGENT_WALLET_ADDRESS) {
                        role = "consumer";
                    } else {
                        console.log(`Skipping job ${jobId} as the role is unknown`);
                        return;
                    }

                    await processJob(acpClient, activeJob, role);
                });

                // Wait for all jobs to be processed
                await Promise.allSettled(jobPromises);

            } catch (error) {
                console.error(`Error in job polling cycle:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, pollingInterval));
        }

    } catch (error) {
        console.error("Error in ACP job handler:", error);
        console.log("Restarting ACP job handler in 30 seconds...");
        setTimeout(() => {
            handleAcpJobs().catch(console.error);
        }, 30000);
    }
}

// Start the ACP job handler
handleAcpJobs().catch(console.error);
