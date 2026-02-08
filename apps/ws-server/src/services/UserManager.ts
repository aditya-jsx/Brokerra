import WebSocket from "ws";
import { RedisManager } from "./redis";

export class UserManager{
    private static instance: UserManager;
    private subscriptions: Map<string, WebSocket[]> = new Map();
    
    private constructor(){}

    // creating a new instance if there is none
    public static getInstance(){
        if(!this.instance){
            this.instance = new UserManager();
        }
        return this.instance;
    }

    // adding users to listen
    public subscribe(channel: string, ws:WebSocket){
        const subscribers = this.subscriptions.get(channel) || [];

        if(subscribers.length === 0){
            RedisManager.getInstance().subscribe(channel);
        }

        this.subscriptions.set(channel, [...subscribers, ws]);
        console.log(`User added to channel: ${channel}`);
    }

    // removing users
    public unsubscribe(channel: string, ws:WebSocket){
        const subscribers = this.subscriptions.get(channel) || []
        if(!subscribers) return;

        const newSubscribers = subscribers.filter(s => s !== ws);
        this.subscriptions.set(channel, newSubscribers);

        if(newSubscribers.length === 0){
            RedisManager.getInstance().unsubscribe(channel);
        }
    }

    // broadcasting msgs to all users
    public broadCast(channel: string, message: any){
        const subscribers = this.subscriptions.get(channel);
        if(!subscribers) return;

        subscribers.forEach(ws => {
            if(ws.readyState === WebSocket.OPEN){
                ws.send(JSON.stringify(message));
            }
        });
    }
}