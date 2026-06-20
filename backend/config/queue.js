const { Queue } = require('bullmq');

const IORedis = require('ioredis');

const connection = process.env.REDIS_URL 
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
    };

const videoQueue = new Queue('video-processing', { connection });

module.exports = { videoQueue, connection };
