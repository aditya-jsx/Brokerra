import { createClient, type RedisClientType } from "redis";
import WebSocket from "ws";
import { publishToRedisChannel } from "./router/router";
// const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade/btcusdt@trade/ethusdt@trade/bnbusdt@trade");
// const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/bnbusdt@trade/dogeusdt@trade");

export const client: RedisClientType = createClient({
    url: "redis://localhost:6379"
});

client.on('error', err => console.log('Redis Client Error', err));

async function init(){
    try{
        await client.connect();
        console.log("Redis Connected");

        connectBinance();
    }catch(e){
        console.error("Failed to connect to Redis", e);
        process.exit(1);
    }
}

function connectBinance(){
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade/btcusdt@trade/ethusdt@trade/bnbusdt@trade");

    ws.on("open", () => {
        console.log("Connected to Binance");
    })

    ws.on("message", (data) => {
        try{
            const parseData = JSON.parse(data.toString());
            if(parseData.s){
                parseData.s = parseData.s.toUpperCase();
            }
            publishToRedisChannel(parseData);
        }catch(e){
            console.error("Error parsing message");
        }
    });

    ws.on("close", () => {
        setTimeout(connectBinance, 5000);
    });

    ws.on("error", (error) => {
        console.error("WebSocket Error: ", error.message);
        ws.terminate();
    })
}

init();