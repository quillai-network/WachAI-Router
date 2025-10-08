/**
 * Fetches token check details from quillcheck api.
 *
 * @returns A promise that resolves to an object containing token check details.
 * @throws {Error} Throws an error if the API request fails or if there is an issue with fetching the data.
 */
export const checkResult = async (tokenAddress: string, chainId = "1") => {
  try {
    let url = `https://check-api.quillai.network/api/v1/tokens/information/${tokenAddress}?chainId=${chainId}`;
    if (chainId === "900") {
      url = `https://check-api.quillai.network/api/v1/tokens/solana/${tokenAddress}`;
    }
    const chainMap = {
      "1": "eth",
      "56": "bsc",
      "137": "polygon",
      "8453": "base",
      "900": "solana",
    };
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.QCAPIKEY || "", // Provide empty string as fallback
      },
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.statusText}`);
      return {
        error: true,
        message: response.statusText,
      };
    }
    const chainName = chainMap[chainId as keyof typeof chainMap];
    const resJSON = await response.json();
    resJSON.source = `https://check.quillai.network/${chainName}/${tokenAddress}`;
    resJSON.chatLink = `https://wach.ai/chat?message=check%20${tokenAddress}%20on%20${chainName}`;
    resJSON.chainName = chainName;
    return resJSON;
  } catch (error: any) {
    console.error(
      `Error fetching quillcheck result for token: ${tokenAddress} of chain: ${chainId} ==> `,
      error.message,
    );
    return {
      error: true,
      message: error.message,
    }; // return empty object if error
  }
};

/**
 * Fetches token audit report from shield api.
 *
 * @param tokenAddress - The contract address of the token
 * @param chainId - The chain ID (default: "1")
 * @returns A promise that resolves to an object containing token audit report.
 * @throws {Error} Throws an error if the API request fails or if there is an issue with fetching the data.
 */
export const getAuditResult = async (tokenAddress: string, chainId = "1") => {
  try {
    const url = `https://shield-api.quillai.network/api/v1/project/audit/direct?address=${tokenAddress}&chainId=${chainId}`;
    console.log(url)
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.SHIELD_API_KEY || ""
      },
    });

    if (!response.ok) {
      console.error(`Audit API request failed: ${response.statusText}`);
      return {
        error: true,
        message: response.statusText,
      };
    }

    const auditResult = await response.json();
    return auditResult;
  } catch (error: any) {
    console.error(
      `Error fetching audit result for token: ${tokenAddress} of chain: ${chainId} ==> `,
      error.message,
    );
    return {
      error: true,
      message: error.message,
    };
  }
};