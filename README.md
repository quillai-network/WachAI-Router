# WachAI-Router

> An intelligent verification cluster router that routes verification jobs to specialized sub-agents based on job requirements and agent capabilities.

## Overview

WachAI-Router is the main orchestration agent for the **Verification Cluster** in the WachAI ecosystem. It acts as a smart router that receives verification job requests through the ACP (Agent Communication Protocol) and intelligently routes them to specialized sub-agents within its cluster. The router selects agents that deliver the highest quality for each specific job type and match the job criteria.

### Key Features

- **Intelligent Job Classification**: verification categories help determine the appropriate service type
- **Automatic Routing**: Routes jobs to specialized sub-agents based on service requirements
- **Job State Management**: Tracks job progress through all phases using Redis persistence
- **Dual Role Operation**: Functions as both provider (receiving jobs) and consumer (routing to sub-agents)
- **High Performance**: Parallel job processing with optimized agent caching

## Architecture

```
┌─────────────────┐
│   Client Job    │
│    Request      │
└────────┬────────┘
         │
         v
┌─────────────────────────┐
│   WachAI-Router Agent   │
│   (Verification Cluster │
│      Main Agent)        │
└──────────┬──────────────┘
           │
           │
           │
           ├─── Job Routing
           │
           v
    ┌──────┴──────┐
    │             │
    v             v
┌─────────┐  ┌──────────────┐
│ Sentry  │  │ TokenSense   │
│ Agent   │  │ Agent        │
│ (Audit) │  │ (Verify)     │
└─────────┘  └──────────────┘
```

### Sub-Agent Clusters

WachAI router can support multiple sub agents for each job category. Currently, the router manages connections to the following specialized agents:

- **Sentry:wachAI** - Smart contract verification
- **TokenSense:wachAI** - Token verification

## How It Works

1. **Job Reception**: Router receives a job request via ACP with service requirements
2. **Classification**: AI analyzes the request and classifies it.
3. **Routing**: Job is routed to the appropriate sub-agent in the cluster
4. **Tracking**: Router tracks both the original job and routed job through all phases
5. **Delivery**: Once sub-agent completes work, router delivers results back to original client

### Job Lifecycle

The router handles jobs through all ACP phases:

| Phase | Router as Provider | Router as Consumer |
|-------|-------------------|-------------------|
| **REQUEST** | Classify job & route to sub-agent | - |
| **NEGOTIATION** | - | Accept job on behalf of cluster |
| **TRANSACTION** | Pay sub-agent & wait for completion | - |
| **EVALUATION** | - | Forward deliverable to client |
| **COMPLETED** | Deliver results to client | Evaluate sub-agent work |

## Technology Stack

- **Language**: TypeScript
- **ACP Protocol**: `@virtuals-protocol/acp-node` for agent communication
- **AI Classification**: OpenAI GPT-4 for intelligent job routing
- **State Management**: Redis (ioredis) for job tracking and persistence
- **Runtime**: Node.js

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd WachAI-Router

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Agent Configuration
PRIVATE_KEY=your_private_key_without_0x_prefix
ENTITY_ID=your_entity_id
AGENT_WALLET_ADDRESS=0xyour_agent_wallet_address

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Polling Configuration
POLLING_INTERVAL=60000  # milliseconds (default: 60 seconds)
```

## Usage

### Development Mode

```bash
npm run dev
```

Runs the agent in development mode with auto-restart on file changes.

### Production Mode

```bash
# Build the project
npm run build

# Start the agent
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run specific tests
npm run test:acp          # ACP integration tests
npm run test:acp-buyer    # Buyer role tests
npm run test:hybrid       # Hybrid agent tests
```

## Redis Data Structure

### Job Stages
```typescript
{
  original_job_id: number;
  routed_job_id: number;
  routed_to_agent: string;
  target_agent_name: string;
  target_agent_address: string;
  job_phase: "ROUTED" | "ACCEPTED" | "PAID" | "COMPLETED" | "REJECTED";
  responded_to_request: boolean;
  delivered_work: boolean;
}
```

## API Reference

### Core Functions

#### `createAgentResponseForACP(taskPrompt: string)`
Classifies job requests using AI.

**Returns**: 
```typescript
{
  offering: "verify_contract" | "audit_contract" | null,
  message: string
}
```

#### `handleRequestPhase(acpClient, job, jobStages, role)`
Handles job classification and routing in the REQUEST phase.

#### `handleNegotiationPhase(acpClient, job, jobStages, role)`
Accepts jobs on behalf of the verification cluster.

#### `handleTransactionPhase(acpClient, job, jobStages, role)`
Manages payment to sub-agents and monitors completion.

#### `handleEvaluationPhase(acpClient, job, jobStages, role)`
Forwards deliverables and evaluates sub-agent work.

## Performance Optimizations

- **Agent Caching**: Sub-agents are cached on initialization to avoid repeated lookups
- **Parallel Processing**: Multiple active jobs are processed concurrently
- **Redis Persistence**: Job mappings survive restarts
- **Error Recovery**: Automatic restart with 30-second delay on critical failures

## Error Handling

The router includes comprehensive error handling:

- **Invalid Jobs**: Jobs without service requirements are logged and skipped
- **Missing Agents**: Jobs are rejected if target sub-agent is unavailable
- **Routing Failures**: Failed routing attempts are logged and job is rejected
- **Connection Issues**: Auto-restart mechanism for critical failures

## Monitoring

The router provides detailed console logging for:
- Job reception and classification
- Routing decisions and target agents
- Phase transitions
- Payment processing
- Deliverable forwarding
- Error conditions

## Development

### Project Structure

```
WachAI-Router/
├── src/
│   ├── agent.ts              # Main agent logic
│   └── helpers/
│       ├── agent.ts          # AI classification
│       └── redis.ts          # State management
├── test/
│   ├── router-agent.test.ts # Router functionality tests
│   ├── acp.test.ts          # ACP integration tests
│   └── hybrid-agent.test.ts # Hybrid mode tests
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env
```

### Building

```bash
# Clean build artifacts
npm run clean

# Compile TypeScript
npm run build

# Output in dist/ directory
```

## Contributing

When contributing to WachAI-Router:

1. Maintain TypeScript strict mode compliance
2. Add tests for new routing logic
3. Update Redis schema documentation for new state fields
4. Follow existing error handling patterns
5. Add console logging for debugging

## License

ISC

## Author

QuillAI-Network

---

## Support

For issues, questions, or contributions, please refer to the project's issue tracker or contact the QuillAI-Network team.

## Roadmap

- [ ] Dynamic sub-agent discovery
- [ ] Quality-based agent selection
- [ ] Multi-agent consensus routing
- [ ] Advanced job prioritization
- [ ] Performance metrics and analytics
- [ ] WebSocket-based real-time updates

