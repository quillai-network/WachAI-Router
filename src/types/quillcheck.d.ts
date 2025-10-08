// Defines Quillian types

export type CoinData = {
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: number | null;
    last_updated: string;
  };
  
  export type Score = {
    percent: number;
    achievedScore: number;
    maxScore: number;
    minScore: number;
  };
  
  export type TrendingTokens = {
    tokenAddress: string;
    chainId: string;
    tokenName: string;
    tokenImageLink: string;
    totalScore: Score;
    codeScore: Score;
    marketScore: Score;
  };
  
  export type CheckTokenData = {
    name: string;
    symbol: string;
    address: string;
    chainId: string;
    chainName: string;
    source: string;
    chatLink: string;
    tokenInformation: {
      tokenAddress: string;
      tokenName: string;
      tokenSymbol: string;
      tokenCreationDate: string;
      totalSupply: string;
      ownerAddress: string;
      ownerBalance: string;
      creatorAddress: string;
      creatorBalance: string;
      tokenCategories: string[];
      marketData: {
        currentPriceUsd: string;
        marketCapUsd: string;
        pastOneDayHigh: string;
        pastOneDayLow: string;
      };
      socialInformation: {
        githubLinks: string[];
        twitter: {
          name: string;
          followers: number;
        };
        facebook: {
          name: string;
          likes: number | null;
        };
        telegram: {
          name: string;
          members: number | null;
        };
        reddit: {
          url: string;
          subscribers: number | null;
        };
      };
      externalLinks: {
        coinGeckoLink: string;
        blockExplorerLink: string;
        geckoTerminal: string;
      };
    };
    tokenScore: {
      totalScore: Score;
      codeScore: Score;
      marketScore: Score;
    };
    marketChecks: {
      holdersChecks: {
        holdersCount: {
          number: number;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
        };
        keyHolders: {
          address: string;
          percent: number;
          isContract: boolean;
          balance: string;
        }[];
        percentDistributed: {
          topThree: {
            percent: number;
            balance: string;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          topTen: {
            percent: number;
            balance: string;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          owner: {
            percent: number;
            balance: string;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          creator: {
            percent: number;
            balance: string;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          burnt: {
            percent: number | null;
            balance: string | null;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          other: {
            percent: number;
            balance: string;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
        };
      };
      liquidityChecks: {
        aggregatedInformation: {
          totalLpSupplyInUsd: {
            number: string;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          lpHolderCount: {
            number: number;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          tradingPairCount: {
            number: number;
            risk: {
              riskRating: number;
              riskStatus: string;
            };
          };
          keyLpHolders: {
            address: string;
            isContract: boolean;
            balanceInUsd: string;
          }[];
          liquidityLockedDetails: {
            upcomingUnlockDetails: any[];
          };
          percentDistributed: {
            topThree: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
            topTen: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
            owner: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
            creator: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
            burnt: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
            locked: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
            other: {
              percent: number;
              balanceInUsd: string;
              risk: {
                riskRating: number;
                riskStatus: string;
              };
            };
          };
        };
        pairByPairInformation: {
          dexName: string;
          token0Address: string;
          token1Address: string;
          lpTotalSupply: string;
          lpSupplyInUsd: string;
          token0Symbol: string;
          token1Symbol: string;
          token0Balance: string;
          token1Balance: string;
          pairAddress: string;
          lpHolders: {
            address: string;
            isContract: boolean;
            balance: string;
            balanceInUsd: string;
          }[];
          pairExplorerLink: string;
        }[];
      };
    };
    codeChecks: {
      ownershipChecks: {
        ownerCanChangeBalance: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        hiddenOwner: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        isMintable: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        selfDestruct: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        transferPausable: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        isOpenSource: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        isBlacklisted: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        slippageModifiable: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        antiwhaleModifiable: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        isWhitelisted: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
      };
      otherChecks: {
        externalCall: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        isProxy: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        tradingCooldown: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
        isAntiWhale: {
          description: string;
          risk: {
            riskRating: number;
            riskStatus: string;
          };
          status: boolean;
        };
      };
    };
    honeypotDetails: {
      isTokenHoneypot: number;
      honeypotFound: {
        poolsSimulated: number;
        totalPools: number;
        honeypotPools: number;
      };
      honeypotPairs: {
        pairAddress: string;
        dex: string;
        honeypotReason: string;
      }[];
    };
  };
  
  export type CheckSolanaData = {
    name: string;
    symbol: string;
    address: string;
    chainId: string;
    source: string;
    chatLink: string;
    honeypotDetails: {
      overAllScore: number;
      overAllScorePercentage: number;
      overAllMaxScore: number;
      overAllMinScore: number;
      buyTax: {
        number: number | null;
        risk: number;
      };
      sellTax: {
        number: number | null;
        risk: number;
      };
      token0Symbol: string;
      token1Symbol: string;
      transferTax: {
        number: number | null;
        risk: number;
      };
      isPairHoneypot: number;
      honeypotReason: string;
      dex: string;
      pair: string[];
      pairAddress: string;
    };
    codeChecks: {
      maxCodeCheckScore: number;
      minCodeCheckScore: number;
      codeCheckScore: number;
      availableChecks: number;
      checksPerformed: number;
      codeCheckScorePercentage: number;
      codeCheckDescription: {
        ownershipPermissionsDescription: {
          heading: string;
          description: string;
          risk: number;
          tags: string[];
          value: string;
        }[];
        externalContractDescription: any[];
        transactionLimitersDescription: any[];
      };
    };
    marketChecks: {
      minMarketCheckScore: number;
      maxMarketCheckScore: number;
      marketCheckScore: number;
      availableChecks: number;
      checksPerformed: number;
      marketCheckScorePercentage: number;
      marketCheckDescription: {
        holdersDescription: {
          holdersCount: {
            number: number;
            risk: number;
          };
          keyHolders: {
            address: string;
            percent: number;
            isContract: boolean | null;
            isLocked: boolean | null;
            balance: string;
          }[];
          eoaHolders: any[];
          contractHolders: any[];
          percentDistributed: {
            topThree: {
              percent: number;
              balance: number;
              balanceFormatted: string;
              risk: number;
            };
            topTen: {
              percent: number;
              balance: number;
              balanceFormatted: string;
              risk: number;
            };
            owner: {
              percent: number | null;
              balance: number | null;
              balanceFormatted: string;
              risk: number;
            };
            creator: {
              percent: number;
              balance: number;
              balanceFormatted: string;
              risk: number;
            };
            burnt: {
              percent: number | null;
              balance: number | null;
              balanceFormatted: string;
              risk: number;
            };
            locked: {
              percent: number;
              balance: number;
              balanceFormatted: string;
              risk: number;
            };
            other: {
              percent: number;
              balance: number;
              balanceFormatted: string;
              risk: number;
            };
          };
        };
        liquidityDescription: {
          aggregatedInformation: {
            totalLpSupplyInUsd: {
              number: string;
              risk: number;
            };
            lpHolderCount: {
              number: number | null;
              risk: number;
            };
            tradingPairCount: {
              number: number;
              risk: number;
            };
            keyLpHolders: any[];
            eoaLpHolders: any[];
            contractLpHolders: any[];
            liquidityLockedDetails: {
              upcomingUnlockDetails: any[];
            };
            percentDistributed: {
              topThree: {
                percent: number;
                balance: number;
                balanceFormatted: string;
                risk: number;
              };
              topTen: {
                percent: number;
                balance: number;
                balanceFormatted: string;
                risk: number;
              };
              owner: {
                percent: number | null;
                balance: number | null;
                balanceFormatted: string;
                risk: number;
              };
              creator: {
                percent: number | null;
                balance: number | null;
                balanceFormatted: string;
                risk: number;
              };
              burnt: {
                percent: number | null;
                balance: number | null;
                balanceFormatted: string;
                risk: number;
              };
              locked: {
                percent: number;
                balance: number;
                balanceFormatted: string;
                risk: number;
              };
              other: {
                percent: number;
                balance: number;
                balanceFormatted: string;
                risk: number;
              };
            };
          };
          pairByPairInformation: {
            dexName: string;
            dexImageLink: string;
            numberOfPairs: number;
            totalLpSupplyInUsd: string;
            pairsInformation: {
              pairAddress: string;
              token0Symbol: string;
              token1Symbol: string;
              token0ImageLink: string;
              token1ImageLink: string;
              pairExplorerLink: string;
              lpSupplyInUsd: string;
              rawLpSupplyInUsd: number;
              token0Balance: string | number;
              token1Balance: string | number;
              dexName: string;
              dexImageLink: string;
            }[];
          }[];
        };
      };
    };
    tokenInformation: {
      generalInformation: {
        lastUpdated: string;
        tokenAddress: string;
        mint: string;
        chainId: string;
        chainName: string;
        tokenName: string;
        tokenSymbol: string;
        tokenImageLink: string;
        tokenCreationDate: string;
        ownerAddress: string;
        categories: string[];
        creatorAddress: string;
      };
      tokenSupplyInformation: {
        centralisedExchanges: any[];
        tokenHoldersCount: number;
        totalSupply: string;
        currentPriceUsd: string;
        marketCapUsd: string;
        pastOneDayHigh: string;
        pastOneDayLow: string;
      };
      socialInformation: {
        githubLinks: string[];
        reddit: {
          name: string;
          url: string;
          subscribers: number | null;
        };
        facebook: {
          name: string;
          url: string;
          likes: number | null;
        };
        twitter: {
          name: string;
          url: string;
          followers: number | null;
        };
        telegram: {
          name: string;
          url: string;
          members: number | null;
        };
        discord: {
          name: string;
          url: string;
        };
        website: {
          url: string;
        };
        externalLinks: {
          coinGeckoLink: string;
          blockExplorerLink: string;
          geckoTerminal: string;
        };
      };
      totalChecksInformation: {
        totalChecks: number;
        checksPerformed: number;
        aggregatedCount: {
          id: number;
          name: string;
          count: number;
        }[];
      };
    };
  };
  
  export type EthereumResponse = {
    ethereum: {
      dexTrades: {
        smartContract: {
          address: {
            address: string;
          };
        };
        baseCurrency: {
          symbol: string;
          name: string;
          decimals: number;
          address: string;
          tokenType: string;
        };
        quoteCurrency: {
          symbol: string;
          address: string;
        };
        price_24h_ago: string;
        price_last: string;
        diff: string;
        div: string;
        final: string;
      }[];
    };
  };
  
  export type SolanaResponse = {
    Solana: {
      DEXTradeByTokens: {
        Trade: {
          Currency: {
            MintAddress: string;
            Name: string;
            Symbol: string;
          };
          Side: {
            Currency: {
              MintAddress: string;
              Name: string;
              Symbol: string;
            };
          };
          price_24h_ago: number;
          price_last: number;
        };
        totalTrade: string;
      }[];
    };
  };
  
  export type EVMResponse = {
    EVM: {
      DEXTradeByTokens: {
        Trade: {
          Currency: {
            Name: string;
            SmartContract: string;
            Symbol: string;
          };
          Side: {
            Currency: {
              Name: string;
              SmartContract: string;
              Symbol: string;
            };
          };
          price_24h_ago: number;
          price_last: number;
        };
        amount: string;
        avg: number;
        buyers: string;
        count: string;
        dexes: string;
        max: number;
        min: number;
        sellers: string;
        usd: string;
      }[];
    };
  };
  
  // File class to represent a file with its name and data
  export type File = {
    name: string;
    data: string;
  };
  
  export type CustomError = {
    code: string;
    message: string;
  };
  