import { createClient, type RedisClientType } from "redis";

export const client: RedisClientType = createClient({
    url: "redis://localhost:6379"
})

client.on('error', err => console.log('Redis Client Error', err));

export async function connectToRedis(){
    if(!client.isOpen){
        await client.connect();
        console.log("Redis Connected");
    }
}