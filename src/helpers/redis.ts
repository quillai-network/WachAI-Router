import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    tls: {}
});

// Redis key prefix for processed job stages
const JOB_STAGE_KEY_PREFIX = "processedJobStage:";
const JOB_MAPPING_KEY_PREFIX = "jobMapping:";
const JOB_MAPPING_SET_KEY = "jobMappings";

// Helper to get job stage from Redis
export async function getJobStage(jobId: string) {
    const data = await redis.get(`${JOB_STAGE_KEY_PREFIX}${jobId}`);
    return data ? JSON.parse(data) : {};
}

// Helper to set job stage in Redis
export async function setJobStage(jobId: string, stage: any) {
    await redis.set(`${JOB_STAGE_KEY_PREFIX}${jobId}`, JSON.stringify(stage), 'EX', 60 * 60 * 24);
}

// Job mapping persistence functions
export async function addJobMapping(originalJobId: number, routedJobId: number) {
    const mapping = { original_job_id: originalJobId, routed_job_id: routedJobId };
    const key = `${JOB_MAPPING_KEY_PREFIX}${originalJobId}:${routedJobId}`;
    
    // Store individual mapping
    await redis.set(key, JSON.stringify(mapping), 'EX', 60 * 60 * 24 * 7); // 7 days
    
    // Add to set for easy lookup
    await redis.sadd(JOB_MAPPING_SET_KEY, key);
}

export async function getJobMappingByOriginal(originalJobId: number) {
    const keys = await redis.smembers(JOB_MAPPING_SET_KEY);
    for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
            const mapping = JSON.parse(data);
            if (mapping.original_job_id === originalJobId) {
                return mapping;
            }
        }
    }
    return null;
}

export async function getJobMappingByRouted(routedJobId: number) {
    const keys = await redis.smembers(JOB_MAPPING_SET_KEY);
    for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
            const mapping = JSON.parse(data);
            if (mapping.routed_job_id === routedJobId) {
                return mapping;
            }
        }
    }
    return null;
}

export async function removeJobMapping(originalJobId: number, routedJobId: number) {
    const key = `${JOB_MAPPING_KEY_PREFIX}${originalJobId}:${routedJobId}`;
    await redis.del(key);
    await redis.srem(JOB_MAPPING_SET_KEY, key);
}

// Load all job mappings from Redis (for initialization)
export async function loadAllJobMappings() {
    const keys = await redis.smembers(JOB_MAPPING_SET_KEY);
    const mappings = [];
    
    for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
            mappings.push(JSON.parse(data));
        }
    }
    
    return mappings;
}

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (error) => {
    console.error("Redis error", error);
});