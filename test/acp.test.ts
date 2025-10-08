import { createAgentResponseForACP } from '../src/helpers/agent';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testACPAgent() {
    try {
        const response = await createAgentResponseForACP('Audit 0xdAC17F958D2ee523a2206206994597C13D831ec7 on ethereum chain');
        console.log(response.formattedResponse);
        // save response in a file
        fs.writeFileSync('response.json', JSON.stringify(response.response, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
testACPAgent();
