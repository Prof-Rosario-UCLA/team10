import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: '10.172.72.35',
    port: 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis failed to connect:', err);
  }
}

connectRedis();

export default redisClient;