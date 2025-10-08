# Hybrid Agent for ACP (Agent Commerce Protocol)

This hybrid agent acts as a router in the ACP ecosystem, receiving jobs as a seller and routing them to other agents as a buyer.

## Architecture

The hybrid agent combines both seller and buyer functionality:

1. **Seller Mode**: Receives job requests from other agents
2. **Buyer Mode**: Routes those requests to target agents and manages the workflow
3. **Router Logic**: Passes responses back and forth between the original requester and target agent

## How It Works

### Job Flow

1. **REQUEST Phase**: 
   - Hybrid agent receives a job request
   - Finds the target agent using `browseAgents()`
   - Creates a new job with the target agent
   - Accepts the original job

2. **NEGOTIATION Phase**:
   - Hybrid agent pays for the routed job with the target agent

3. **TRANSACTION Phase**:
   - Target agent delivers work to the hybrid agent
   - Hybrid agent forwards the deliverable to the original requester

4. **EVALUATION Phase**:
   - Hybrid agent evaluates the work from the target agent
   - Original requester can evaluate the final deliverable

## Configuration

### Environment Variables

```bash
# Seller Agent Configuration (for receiving jobs)
PRIVATE_KEY=your_seller_private_key_without_0x_prefix
ENTITY_ID=your_seller_entity_id
AGENT_WALLET_ADDRESS=your_seller_wallet_address

# Buyer Agent Configuration (for routing jobs)
BUYER_PRIVATE_KEY=your_buyer_private_key_without_0x_prefix
BUYER_ENTITY_ID=your_buyer_entity_id
BUYER_AGENT_WALLET_ADDRESS=your_buyer_wallet_address

# Target Agent Configuration
TARGET_AGENT_NAME=Sentry:wachAI

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Polling Configuration
POLLING_INTERVAL=60000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

### Key Configuration Notes

- You need **two separate wallet addresses**: one for receiving jobs (seller) and one for routing jobs (buyer)
- The `TARGET_AGENT_NAME` specifies which agent to route jobs to
- Redis is used to track job states and routing information

## Running the Hybrid Agent

### Development Mode
```bash
npm run dev:hybrid
```

### Production Mode
```bash
npm run build
npm run start:hybrid
```

## Job State Tracking

The hybrid agent uses Redis to track:

- Original job states (responded_to_request, delivered_work)
- Routing information (routed_to_agent, routed_job_id)
- Target agent details (target_agent_name, target_agent_address)

## Error Handling

The hybrid agent includes comprehensive error handling:

- Graceful handling of missing target agents
- Error recovery for failed job routing
- Automatic retry mechanisms
- Detailed logging for debugging

## Use Cases

1. **Service Aggregation**: Route different types of requests to specialized agents
2. **Load Balancing**: Distribute work across multiple similar agents
3. **Protocol Translation**: Adapt requests between different agent protocols
4. **Quality Assurance**: Add validation layers between requesters and service providers

## Monitoring

The hybrid agent provides detailed console logging for:

- Job routing decisions
- Phase transitions
- Error conditions
- Performance metrics

## Security Considerations

- Keep private keys secure and never commit them to version control
- Use separate wallets for seller and buyer roles
- Monitor job routing patterns for unusual activity
- Implement rate limiting if needed

## Troubleshooting

### Common Issues

1. **Target Agent Not Found**: Check the `TARGET_AGENT_NAME` configuration
2. **Payment Failures**: Ensure buyer wallet has sufficient funds
3. **Redis Connection Issues**: Verify Redis server is running and accessible
4. **Job Stuck in Phase**: Check logs for specific error messages

### Debug Mode

Enable detailed logging by setting the polling interval to a lower value and monitoring console output.
