import { tokenAuditCheck } from "./definitions";
import { ChatCompletionTool } from "openai/resources";

export const tools: ChatCompletionTool[] = [tokenAuditCheck];
