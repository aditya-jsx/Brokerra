import { createClient, type RedisClientType } from "redis";
import WebSocket from "ws";
const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade/btcusdt@trade/ethusdt@trade/bnbusdt@trade");

export const client: RedisClientType = createClient({
    url: "redis://localhost:6379"
});

client.on('error', err => console.log('Redis Client Error', err));

export async function connectToRedis(){
    if(!client.isOpen){
        await client.connect();
        console.log("Redis Connected");
    }
}

ws.on("open",() => {
    console.log("Connected to Redis");
})

ws.on("message", (message) => {
    console.log("Receiving messages from Binance");
})