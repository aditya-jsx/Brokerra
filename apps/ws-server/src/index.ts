import { WebSocketServer } from "ws";
import { client, connectToRedis } from "./services/redis";

const wss = new WebSocketServer({ port: 8080 });

function init(){
  wss.on('connection', async function connection(ws) {
      ws.on('error', console.error);
      console.log("Connected to ws");
      try{
        await connectToRedis();
        console.log("connected to redis");
        let session = await client.hGetAll('asset:BTCUSDT')
        console.log(session)
      }catch(e){
        console.error("Failed to connect to pooler", e);
      }
  });
}

init();