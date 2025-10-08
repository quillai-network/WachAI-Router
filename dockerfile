FROM node:20-slim

RUN mkdir /wachxbt-acp

WORKDIR /wachxbt-acp

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
