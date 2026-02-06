import { createClient, type RedisClientType } from "redis";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

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

let session = client.hGetAll('asset')
console.log(session)

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

});