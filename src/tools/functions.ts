import { checkResult, getAuditResult } from "../helpers/apiHelper";
import { formatAuditResponse } from "../utils/formatter";

export async function call(name: string, args: string) {
  const functionMapping: { [key: string]: Function } = {
    get_token_audit_report: get_token_audit_report
  };

  const result = await functionMapping[name](JSON.parse(args));

  return result;
}

async function get_token_audit_report(obj: any) {
  try {
    const address = obj.address;
    const chainId = obj.chainId;
    
    if (!address || !chainId) {
      return {
        result: "Error: Both token address and chainId are required for audit report",
        rawResults: null
      };
    }

    const auditResult = await getAuditResult(address, chainId);
    
    if (auditResult.error) {
      return {
        result: `Error fetching audit report: ${auditResult.message}`,
        rawResults: null
      };
    }
    console.log("auditResult", auditResult);
    const formattedReport = formatAuditResponse(auditResult.auditReport);
    // Return the raw audit result without formatting as requested
    return {
      result: formattedReport,
      rawResults: auditResult
    };
  } catch (error) {
    console.error("Error in get_token_audit_report: ", error);
    return {
      result: `Error generating audit report: ${error}`,
      rawResults: null
    };
  }
}