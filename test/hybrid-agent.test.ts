import dotenv from "dotenv";
import AcpClient, { AcpContractClient, AcpGraduationStatus, AcpOnlineStatus } from "@virtuals-protocol/acp-node";

dotenv.config();

/**
 * Test script for the hybrid agent functionality
 * This script tests the core routing capabilities without running the full agent
 */
async function testHybridAgentFunctionality() {
    try {
        console.log("Testing Hybrid Agent Functionality...");
        
        // Test seller client initialization
        console.log("1. Testing seller client initialization...");
        const sellerContractClient = await AcpContractClient.build(
            `0x${process.env.PRIVATE_KEY}` as `0x${string}`,
            parseInt(process.env.ENTITY_ID as string),
            process.env.AGENT_WALLET_ADDRESS as `0x${string}`,
        );

        const sellerClient = new AcpClient({
            acpContractClient: sellerContractClient,
        });
        console.log("✅ Seller client initialized successfully");

        // Test buyer client initialization
        console.log("2. Testing buyer client initialization...");
        const buyerContractClient = await AcpContractClient.build(
            `0x${process.env.BUYER_PRIVATE_KEY}` as `0x${string}`,
            parseInt(process.env.BUYER_ENTITY_ID as string),
            process.env.BUYER_AGENT_WALLET_ADDRESS as `0x${string}`,
        );

        const buyerClient = new AcpClient({
            acpContractClient: buyerContractClient,
        });
        console.log("✅ Buyer client initialized successfully");

        // Test agent browsing functionality
        console.log("3. Testing agent browsing functionality...");
        const targetAgentName = process.env.TARGET_AGENT_NAME || "Sentry:wachAI";
        const relevantAgents = await buyerClient.browseAgents(
            targetAgentName,
            {
                graduationStatus: AcpGraduationStatus.NOT_GRADUATED,
                onlineStatus: AcpOnlineStatus.ALL,
            }
        );

        if (relevantAgents.length > 0) {
            console.log(`✅ Found ${relevantAgents.length} target agents matching "${targetAgentName}"`);
            console.log(`   - Agent: ${relevantAgents[0].name}`);
            console.log(`   - Address: ${relevantAgents[0].address}`);
            console.log(`   - Offerings: ${relevantAgents[0].offerings.length}`);
        } else {
            console.log(`⚠️  No target agents found matching "${targetAgentName}"`);
        }

        // Test active jobs retrieval
        console.log("4. Testing active jobs retrieval...");
        const sellerActiveJobs = await sellerClient.getActiveJobs();
        const buyerActiveJobs = await buyerClient.getActiveJobs();
        
        console.log(`✅ Seller active jobs: ${sellerActiveJobs.length}`);
        console.log(`✅ Buyer active jobs: ${buyerActiveJobs.length}`);

        // Test Redis connection (if available)
        console.log("5. Testing Redis connection...");
        try {
            const { getJobStage, setJobStage } = await import("../src/helpers/redis");
            await setJobStage("test_job", { test: true });
            const testData = await getJobStage("test_job");
            if (testData.test) {
                console.log("✅ Redis connection working");
            } else {
                console.log("⚠️  Redis connection issue - data not persisted");
            }
        } catch (error) {
            console.log("⚠️  Redis connection failed:", error.message);
        }

        console.log("\n🎉 Hybrid Agent functionality test completed!");
        console.log("\nTo run the hybrid agent:");
        console.log("  npm run dev:hybrid");

    } catch (error) {
        console.error("❌ Test failed:", error);
        console.log("\nTroubleshooting:");
        console.log("1. Check your .env file configuration");
        console.log("2. Ensure all required environment variables are set");
        console.log("3. Verify wallet addresses and private keys");
        console.log("4. Check network connectivity");
    }
}

// Run the test
testHybridAgentFunctionality();
