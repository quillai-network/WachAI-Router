import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function createAgentResponseForACP(taskPrompt: string) : Promise<{ offering: string | null, message: string }> {
  try {
    const smartContextProvider = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a task classifier for blockchain services. Analyze the user prompt and determine which offering it matches:

OFFERINGS:
1. "verify_contract" - For contract verification, due diligence, token verification, checking contracts, etc.
   Keywords: verify, check contract, due diligence, dd, token verification, validate contract, inspect contract

2. "audit_contract" - For smart contract audits and security analysis
   Keywords: audit, security audit, smart contract audit, code review for security

3. null - If the prompt doesn't match any of the above offerings

Return ONLY a valid JSON object with this exact structure:
{"offering": "verify_contract" | "audit_contract" | null, "message": "explanation of why this offering was chosen or why no offering matches"}`,
        },
        {
          role: "user",
          content: `Classify this prompt and return the appropriate offering: ${taskPrompt}`,
        },
      ],
      model: "gpt-4o",
      top_p: 1,
      temperature: 0.3,
    });

    const response = smartContextProvider.choices[0].message.content;

    // Try to parse the JSON response
    try {
      if (!response) {
        return { offering: null, message: "I'm not able to understand the task, Please try again" };
      }
      return JSON.parse(response);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", response);
      return { offering: null, message: "I couldn't classify the task, Please try again" };
    }
  } catch (error) {
    console.error("Error in getContextFromString: ", error);
    return { offering: null, message: "I couldn't classify the task, Please try again" };
  }
}
