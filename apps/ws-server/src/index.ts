import { WebSocketServer } from "ws";
import { UserManager } from "./services/UserManager";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async function connection(ws) {
  console.log("New user connected to ws server")
  ws.on('error', console.error);
  
  ws.on("message", async function message(data){
    try{
      const {type, payload} = JSON.parse(data.toString());
      if(type === "SUBSCRIBE"){
          payload.securities.forEach((s:string) => {
            UserManager.getInstance().subscribe(s, ws)
          })
      }
      if(type === "UNSUBSCRIBE"){
          payload.securities.forEach((s:string) => {
            UserManager.getInstance().unsubscribe(s, ws)
          })
      }
    }catch(e){
      console.error("Failed to parse the message", e);
    }
  })
  // ws.on("close", () => {})
});