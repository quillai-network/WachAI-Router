import { CheckSolanaData, CheckTokenData } from "../types/quillcheck";

export const chainMap: Record<string, string> = {
  "1": "eth",
  "56": "bsc",
  "137": "polygon",
  "8453": "base",
  "900": "solana",
};

export function formatResponseSolana(response: CheckSolanaData): string {
  if (!response || typeof response !== "object") {
    return "Invalid response format";
  }

  const formatBasicInfo = () => {
    const { tokenName, tokenSymbol, tokenAddress, tokenCreationDate, categories, creatorAddress, ownerAddress } = 
      response.tokenInformation?.generalInformation || {};
    const categoriesList = categories?.length ? categories.join(", ") : "None";

    return `
Basic Information
    • Name: ${tokenName || "N/A"}
    • Symbol: ${tokenSymbol || "N/A"} 
    • Chain: Solana
    • Address: ${tokenAddress || "N/A"}
    ${tokenCreationDate ? `• Creation Date: ${tokenCreationDate}` : ""}
    ${categoriesList !== "None" ? `• Categories: ${categoriesList}` : ""}
    ${creatorAddress ? `• Creator Address: ${creatorAddress}` : ""}
    ${ownerAddress ? `• Owner Address: ${ownerAddress}` : ""}`;
  };

  const formatMarketData = () => {
    const { currentPriceUsd, marketCapUsd, pastOneDayHigh, pastOneDayLow } = 
      response.tokenInformation?.tokenSupplyInformation || {};
    return `
Market Data
    ${currentPriceUsd ? `• Current Price (USD): $${currentPriceUsd}` : ""}
    ${marketCapUsd ? `• Market Cap (USD): $${marketCapUsd}` : ""}
    ${pastOneDayHigh ? `• 24h High: $${pastOneDayHigh}` : ""}
    ${pastOneDayLow ? `• 24h Low: $${pastOneDayLow}` : ""}`;
  };

  const formatHoldersDistribution = () => {
    const { holdersCount, percentDistributed } = 
      response.marketChecks?.marketCheckDescription?.holdersDescription || {};
    return `
Holders & Distribution
    ${holdersCount?.number ? `• Total Holders: ${holdersCount.number}` : ""}
    ${percentDistributed?.topThree?.percent ? `• Top 3 Holders Own: ${percentDistributed.topThree.percent}%` : ""}
    ${percentDistributed?.topTen?.percent ? `• Top 10 Holders Own: ${percentDistributed.topTen.percent}%` : ""}
    ${percentDistributed?.owner?.balanceFormatted ? `• Owner Balance: ${percentDistributed.owner.balanceFormatted}` : ""}
    ${percentDistributed?.creator?.balanceFormatted ? `• Creator Balance: ${percentDistributed.creator.balanceFormatted}` : ""}`;
  };

  const formatLiquidityChecks = () => {
    const { totalLpSupplyInUsd, lpHolderCount, tradingPairCount, percentDistributed } =
      response.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation || {};
    return `
Liquidity Checks
    ${totalLpSupplyInUsd?.number ? `• Total LP Supply (USD): ${totalLpSupplyInUsd.number}` : ""}
    ${lpHolderCount?.number ? `• LP Holders Count: ${lpHolderCount.number}` : ""}
    ${tradingPairCount ? `• Trading Pairs: ${tradingPairCount}` : ""}
    ${percentDistributed?.locked?.percent ? `• Liquidity Locked: ${percentDistributed.locked.percent}%` : ""}`;
  };

  const formatSecurityChecks = () => {
    const ownershipChecks = response.codeChecks?.codeCheckDescription?.ownershipPermissionsDescription || [];
    const isMintable = ownershipChecks.some((desc: any) => 
      desc.heading.includes("Minting Authority") && desc.heading.includes("Disabled")) ? "No" : "Yes";
    const isTransferFeeModifiable = ownershipChecks.some((desc: any) =>
      desc.heading.includes("Transfer Fee") && desc.heading.includes("not Modifiable")) ? "No" : "Possibly";

    return `
Security Checks
    • Mintable: ${isMintable}
    • Transfer Fee Modifiable: ${isTransferFeeModifiable}`;
  };

  const formatHoneypotAnalysis = () => {
    const { isPairHoneypot, honeypotReason } = response.honeypotDetails || {};
    const isHoneypotText = isPairHoneypot === 1 ? "Yes" : "No";
    return `
Honeypot Analysis
    • Is Honeypot: ${isHoneypotText}
    • Honeypot Reason: ${honeypotReason || "N/A"}`;
  };

  const formatExternalLinks = () => {
    const { blockExplorerLink, coinGeckoLink, geckoTerminal } = 
      response.tokenInformation?.socialInformation?.externalLinks || {};
    return `
External Links
    • Explorer: ${blockExplorerLink || "N/A"}
    • CoinGecko: ${coinGeckoLink || "N/A"}
    • GeckoTerminal: ${geckoTerminal || "N/A"}`;
  };

  const formatTokenScore = () => {
    const { overAllScore, overAllScorePercentage } = response.honeypotDetails || {};
    const { codeCheckScore } = response.codeChecks || {};
    const { marketCheckScore } = response.marketChecks || {};
    if (!overAllScore || !overAllScorePercentage || !codeCheckScore || !marketCheckScore) {
      return "";
    }
    return `
Token Score
    • Total Score: ${overAllScore}
    • Total Score Percentage: ${overAllScorePercentage}
    • Code Score: ${codeCheckScore}
    • Market Score: ${marketCheckScore}
    `;
  }

  const formattedResponse = `
    ${formatBasicInfo()}
    ${formatMarketData()}
    ${formatHoldersDistribution()}
    ${formatLiquidityChecks()}
    ${formatSecurityChecks()}
    ${formatHoneypotAnalysis()}
    ${formatTokenScore()}
    ${formatExternalLinks()}

Source of Truth
    • QuillCheck Terminal: ${response.source}
    
Chat Link: ${response.chatLink}`;

  return formattedResponse.trim();
}

export function formatResponse(response: CheckTokenData) {
  if (!response || typeof response !== "object") {
    return "Invalid response format";
  }

  const formatMarketData = () => {
    const { currentPriceUsd, marketCapUsd, pastOneDayHigh, pastOneDayLow } = response.tokenInformation?.marketData || {};
    return `
Market Data
    ${currentPriceUsd ? `• Current Price: $${currentPriceUsd}` : ""}
    ${marketCapUsd ? `• Market Cap: $${marketCapUsd}` : ""}
    ${pastOneDayHigh ? `• 24h High: $${pastOneDayHigh}` : ""}
    ${pastOneDayLow ? `• 24h Low: $${pastOneDayLow}` : ""}`;
  };

  const formatHoldersDistribution = () => {
    const { holdersCount, percentDistributed } = response.marketChecks?.holdersChecks || {};
    const { ownerBalance, creatorBalance } = response.tokenInformation || {};
    return `
Holders & Distribution
    ${holdersCount?.number ? `• Total Holders: ${holdersCount.number}` : ""}
    ${percentDistributed?.topThree?.percent ? `• Top 3 Holders Own: ${percentDistributed.topThree.percent}%` : ""}
    ${percentDistributed?.topTen?.percent ? `• Top 10 Holders Own: ${percentDistributed.topTen.percent}%` : ""}
    ${ownerBalance ? `• Owner Balance (Less is better): ${ownerBalance}` : ""}
    ${creatorBalance ? `• Creator Balance (Less is better): ${creatorBalance}` : ""}`;
  };

  /**
   * 
   * @returns @dev liquidity checks are not accurate hence I feel 
   * its better to not include it, atleast for now.
   * @author akshaydevh
   */
  const formatLiquidityChecks = () => {
    const { totalLpSupplyInUsd, lpHolderCount, tradingPairCount, percentDistributed } =
      response.marketChecks?.liquidityChecks?.aggregatedInformation || {};
    return `
Liquidity Checks
    ${totalLpSupplyInUsd?.number ? `• Total LP Supply (USD): ${totalLpSupplyInUsd.number}` : ""}
    ${lpHolderCount?.number ? `• LP Holders Count: ${lpHolderCount.number}` : ""}
    ${tradingPairCount?.number ? `• Trading Pairs: ${tradingPairCount.number}` : ""}
    ${percentDistributed?.locked?.percent ? `• Liquidity Locked: ${percentDistributed.locked.percent}%` : ""}`;
  };

  const formatSecurityChecks = () => {
    const { ownershipChecks, otherChecks } = response.codeChecks || {};
    const checks = [
      { value: ownershipChecks?.isOpenSource?.status, label: "Open Source" },
      { value: ownershipChecks?.isMintable?.status, label: "Mintable" },
      { value: ownershipChecks?.ownerCanChangeBalance?.status, label: "Owner Can Change Balance" },
      { value: ownershipChecks?.transferPausable?.status, label: "Transfer Pausable" },
      { value: ownershipChecks?.slippageModifiable?.status, label: "Slippage Modifiable" },
      { value: ownershipChecks?.antiwhaleModifiable?.status, label: "Anti-whale Modifiable" },
      { value: otherChecks?.tradingCooldown?.status, label: "Trading Cooldown" },
      { value: otherChecks?.externalCall?.status, label: "External Calls Present" }
    ];

    const securityChecks = checks.map(check =>
      `  • ${check.label}: ${check.value ? "Yes" : "No"}`
    ).join("\n");

    return `
    Security Checks
      ${securityChecks}
    `;
  };

  const formatTokenScore = () => {
    const { totalScore, codeScore, marketScore } = response.tokenScore || {};
    if (!totalScore || !codeScore || !marketScore) {
      return "";
    }
    return `
Token Score
    • Total Score: ${totalScore?.achievedScore}
    • Code Score: ${codeScore?.achievedScore}
    • Market Score: ${marketScore?.achievedScore}
    • Total Score Percentage: ${totalScore?.percent}
    `;
  };

  const { tokenInformation, chainName , source, honeypotDetails, chatLink } = response;
  const { tokenName, tokenSymbol, tokenCreationDate, tokenAddress, tokenCategories,
    creatorAddress, ownerAddress, externalLinks } = tokenInformation || {};

  const formattedResponse = `
   Token Analysis Results
   Basic Information
   
     • Name: ${tokenName || "N/A"}
     • Symbol: ${tokenSymbol || "N/A"}
     • Creation Date: ${tokenCreationDate ? new Date(tokenCreationDate).toLocaleDateString() : "N/A"}
     • Address: ${tokenAddress || "N/A"}
     • Categories: ${tokenCategories?.join(", ") || "None"}
     • Chain: ${chainName || "Unknown"}
     ${creatorAddress ? `• Creator Address: ${creatorAddress}` : ""}
     ${ownerAddress ? `• Owner Address: ${ownerAddress}` : ""}
   
     ${formatMarketData()}
   
     ${formatHoldersDistribution()}
   
     ${formatSecurityChecks()}

     ${formatTokenScore()}
   
     Honeypot Analysis
     • Is Honeypot: ${honeypotDetails?.isTokenHoneypot === 1 ? "Yes" : "No"}
     • Pools Analyzed: ${honeypotDetails?.honeypotFound?.poolsSimulated || 0}/${honeypotDetails?.honeypotFound?.totalPools || 0}
   
     External Links
     • Explorer: ${externalLinks?.blockExplorerLink || "N/A"}
     • CoinGecko: ${externalLinks?.coinGeckoLink || "N/A"}
     • GeckoTerminal: ${externalLinks?.geckoTerminal || "N/A"}
   
     Source of Truth
     • QuillCheck Terminal: ${source || "N/A"}

     Chat Link: ${chatLink || "N/A"}
         `;

  return formattedResponse;
}


// Audit Response Types
interface VulnerabilityCount {
  high: number;
  medium: number;
  low: number;
  informational: number;
  optimization: number;
}

interface Vulnerability {
  name: string;
  severity: string;
  description: string;
  recommendation: string;
  explanation: string;
  confidence: string;
  autoFixEnabled: boolean;
  snippet: string;
  lineNumbers: number[];
  tag: string;
  file: string;
  fingerprint: string;
  poc: string;
}

interface AuditReport {
  auditedFiles: number;
  vulnerabilityCount: VulnerabilityCount;
  totalLines: number;
  securityScore: number;
  vulnerabilities: Vulnerability[];
  cost: string;
}

export interface AuditResponse {
  response: Array<{
    auditReport: AuditReport;
  }>;
  error: boolean;
}

/**
 * Formats the audit response into a readable report
 * @param response - The audit response from the API
 * @returns A formatted string containing the audit report
 */
export function formatAuditResponse(auditReport: AuditReport): string {
  
  if (!auditReport) {
    return "❌ No audit report found in response";
  }
  if (typeof auditReport !== "object") {
    return "❌ Invalid audit response format";
  }

  const { auditedFiles, vulnerabilityCount, totalLines, securityScore, vulnerabilities, cost } = auditReport;

  // Format Overview Section
  const formatOverview = () => {
    const totalVulnerabilities = Object.values(vulnerabilityCount).reduce((sum, count) => sum + count, 0);
    const securityGrade = getSecurityGrade(securityScore);
    
    return `
═══════════════════════════════════════════════════════════════
                    SMART CONTRACT AUDIT REPORT
═══════════════════════════════════════════════════════════════

📊 AUDIT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Files Audited: ${auditedFiles}
  • Total Lines of Code: ${totalLines}
  • Security Score: ${securityScore}/100 (${securityGrade})
  • Total Vulnerabilities Found: ${totalVulnerabilities}
  • Audit Cost: ${cost || "N/A"}
`;
  };

  // Format Vulnerability Summary
  const formatVulnerabilitySummary = () => {
    return `
🔍 VULNERABILITY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔴 Critical/High:      ${vulnerabilityCount.high.toString().padStart(3)} issues
  🟠 Medium:             ${vulnerabilityCount.medium.toString().padStart(3)} issues
  🟡 Low:                ${vulnerabilityCount.low.toString().padStart(3)} issues
  ℹ️  Informational:     ${vulnerabilityCount.informational.toString().padStart(3)} issues
  ⚡ Optimization:       ${vulnerabilityCount.optimization.toString().padStart(3)} issues
`;
  };

  // Format Critical Vulnerabilities (High and Medium severity)
  const formatCriticalVulnerabilities = () => {
    const criticalVulns = vulnerabilities.filter(
      v => v.severity === "high" || v.severity === "medium"
    );

    if (criticalVulns.length === 0) {
      return `
🎉 CRITICAL VULNERABILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ No critical vulnerabilities found!
`;
    }

    const criticalSection = criticalVulns.slice(0, 10).map((vuln, index) => {
      const severityIcon = vuln.severity === "high" ? "🔴" : "🟠";
      return `
  ${index + 1}. ${severityIcon} ${vuln.name}
     ├─ Severity: ${vuln.severity.toUpperCase()}
     ├─ Confidence: ${vuln.confidence}
     ├─ File: ${vuln.file}
     ├─ Lines: ${vuln.lineNumbers[0]}-${vuln.lineNumbers[1]}
     ├─ Description: ${truncateText(vuln.description, 150)}
     └─ Recommendation: ${truncateText(vuln.recommendation, 150)}
`;
    }).join("\n");

    const remaining = criticalVulns.length - 10;
    const remainingNote = remaining > 0 ? `\n  ... and ${remaining} more critical issues\n` : "";

    return `
⚠️  CRITICAL VULNERABILITIES (Showing top 10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${criticalSection}${remainingNote}`;
  };

  // Format Vulnerability Summary by Type
  const formatVulnerabilityTypes = () => {
    const typeCount = new Map<string, number>();
    
    vulnerabilities.forEach(vuln => {
      const count = typeCount.get(vuln.name) || 0;
      typeCount.set(vuln.name, count + 1);
    });

    const topTypes = Array.from(typeCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count], index) => `  ${(index + 1).toString().padStart(2)}. ${type}: ${count} occurrence(s)`)
      .join("\n");

    return `
📋 TOP VULNERABILITY TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topTypes}
`;
  };

  // Format Recommendations
  const formatRecommendations = () => {
    const highPriorityVulns = vulnerabilities.filter(v => v.severity === "high" || v.severity === "medium");
    
    if (highPriorityVulns.length === 0) {
      return `
💡 RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Your contract has no critical issues!
  ✓ Consider reviewing low-severity and informational findings
  ✓ Follow best practices for gas optimization
  ✓ Ensure comprehensive test coverage
`;
    }

    return `
💡 KEY RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️  IMMEDIATE ACTION REQUIRED:
  • Address all ${vulnerabilityCount.high} HIGH severity issues immediately
  • Review and fix ${vulnerabilityCount.medium} MEDIUM severity issues
  • Consider addressing ${vulnerabilityCount.low} LOW severity issues
  
  📝 GENERAL RECOMMENDATIONS:
  • Conduct thorough testing after fixes
  • Consider a professional audit for production deployment
  • Implement automated security checks in CI/CD pipeline
  • Review and update dependencies regularly
`;
  };

  // Format Security Score Assessment
  const formatSecurityAssessment = () => {
    let assessment = "";
    let riskLevel = "";
    
    if (securityScore >= 80) {
      riskLevel = "🟢 LOW RISK";
      assessment = "The contract shows good security practices with minimal issues.";
    } else if (securityScore >= 60) {
      riskLevel = "🟡 MODERATE RISK";
      assessment = "The contract has some security concerns that should be addressed.";
    } else if (securityScore >= 40) {
      riskLevel = "🟠 HIGH RISK";
      assessment = "The contract has significant security issues requiring immediate attention.";
    } else {
      riskLevel = "🔴 CRITICAL RISK";
      assessment = "The contract has severe security vulnerabilities. DO NOT DEPLOY without fixes.";
    }

    return `
🛡️  SECURITY ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Risk Level: ${riskLevel}
  Assessment: ${assessment}
`;
  };

  // Construct the full report
  const fullReport = `
${formatOverview()}
${formatVulnerabilitySummary()}
${formatSecurityAssessment()}
${formatCriticalVulnerabilities()}
${formatVulnerabilityTypes()}
${formatRecommendations()}

═══════════════════════════════════════════════════════════════
                      END OF AUDIT REPORT
═══════════════════════════════════════════════════════════════

⚠️  DISCLAIMER: This is an automated audit report. For production
    deployments, always get a professional manual audit.

📊 Powered by WachAI
`;

  return fullReport.trim();
}

/**
 * Helper function to determine security grade based on score
 */
function getSecurityGrade(score: number): string {
  if (score >= 90) return "A+ Excellent";
  if (score >= 80) return "A Good";
  if (score >= 70) return "B Fair";
  if (score >= 60) return "C Poor";
  if (score >= 50) return "D Very Poor";
  return "F Critical";
}

/**
 * Helper function to truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return "N/A";
  text = text.replace(/\n/g, " ").trim();
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}