import { ChatCompletionTool } from "openai/resources";

export const tickerCheck: ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_token_security_for_ticker",
    description:
      `Fetches the security metrics of a token when provided with the token ticker. the ticker check is based on highest popularity and best guess, as there can be many tokens with the same ticker.
      You can provide the chainId to filter results by specific blockchain (1: Ethereum, 56: BSC, 137: Polygon, 8453: Base, 900: Solana)`,
    parameters: {
      type: "object",
      properties: {
        ticker: {
          type: "string",
          description:
            "ticker to fetch security details for. eg (TRUMP, LINK, ETH, EIGEN) etc",
        },
        chainId: {
          type: "string",
          description: "Optional chain ID to filter results by specific blockchain (1: Ethereum, 56: BSC, 137: Polygon, 8453: Base, 900: Solana)",
        }
      },
      required: ["ticker"],
      additionalProperties: false,
    },
  },
};

export const tokenAddressCheck: ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_token_security_for_address",
    description:
      "Fetches the security metrics of a token when provided with the address and chain information of the token, highly accurate as it knows the exact token being referred to. The known chains are ethereum, base, polygon, bsc and solana.",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "address of the token to be searched for",
        },
        chain: {
          type: "string",
          description:
            `the blockchain on which this token resides has to be either of the following (ethereum, base, polygon, bsc and solana). 
            The value will be the chain id of the token.
            The chain id can be one of the following:
            1: Ethereum or Ethereum Mainnet,
            56: BSC or Binance Smart Chain,
            137: Polygon or Polygon Mainnet,
            8453: Base, Base Chain or Base Mainnet,
            900: Solana or Solana Mainnet
            0: for any other chain
            You must provide the chain id as a string.If you don't know the chain id, you can use the default value 8453.`,
        },
      },
      required: ["address", "chain"],
      additionalProperties: false,
    },
    strict: true,
  },
};

export const tokenAuditCheck: ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_token_audit_report",
    description:
      "Fetches the audit report of a token when provided with the token address and chain ID. This provides comprehensive security audit information about the smart contract.",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Contract address of the token to be audited",
        },
        chainId: {
          type: "string",
          description:
            `The blockchain on which this token resides. 
            The chain id can be one of the following:
            1: Ethereum or Ethereum Mainnet,
            56: BSC or Binance Smart Chain,
            137: Polygon or Polygon Mainnet,
            8453: Base, Base Chain or Base Mainnet,
            900: Solana or Solana Mainnet
            You must provide the chain id as a string. If you don't know the chain id, you can use the default value "1".`,
        },
      },
      required: ["address", "chainId"],
      additionalProperties: false,
    },
    strict: true,
  },
};
