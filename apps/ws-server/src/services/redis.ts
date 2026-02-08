import { createClient, type RedisClientType } from "redis";
import { UserManager } from "./UserManager";

// export const client: RedisClientType = createClient({
//     url: "redis://localhost:6379"
// })

// client.on('error', err => console.log('Redis Client Error', err));

// export async function connectToRedis(){
//     if(!client.isOpen){
//         await client.connect();
//         console.log("Redis Connected");
//     }
// }

export class RedisManager{
    private static instance: RedisManager;
    private client: RedisClientType;
    private subscriptions: Set<string> = new Set();

    private constructor(){
        this.client = createClient({ url: "redis://localhost:6379" });
        this.client.connect();

        this.client.on("message", (channel, message) => {
            UserManager.getInstance().broadCast(channel, JSON.parse(message));
        })
    }

    public static getInstance() {
        if(!this.instance){
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public subscribe(channel: string){
        if(!this.subscriptions.has(channel)){
            // added in v4 of redis to pass a callback with subscribe for pub/sub
            this.client.subscribe(channel, (message) => {
                console.log(`Received message on ${channel}: ${message}`);
                const parsedMessage = JSON.parse(message);
                UserManager.getInstance().broadCast(channel, parsedMessage);
            });
            this.subscriptions.add(channel);
            console.log(`Redis Subscribed to: ${channel}`);
        }
    }

    public unsubscribe(channel: string){
        if(this.subscriptions.has(channel)){
            this.client.unsubscribe(channel);
            this.subscriptions.delete(channel);
            console.log(`Redis unsubscribed from: ${channel}`)
        }
    }


}