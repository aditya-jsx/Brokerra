import { client } from "..";
import { ticketData } from "../types/types";

interface Params{
    callback: ()=>void,
    delay: number
}

export async function publishToRedisChannel (data: ticketData){

    const currentPrice = Number(data.p);

    const askPrice = currentPrice + (currentPrice * 0.0005);
    const bidPrice = currentPrice - (currentPrice * 0.0005);

    const name = data.s;
    const channel = name.slice(0, 3);

    const channelObject = { name, askPrice, bidPrice };

    await client.publish(channel, JSON.stringify(channelObject));
    console.log("Published to Redis");

    await client.hSet(`asset: ${name}`, {
        name,
        askPrice,
        bidPrice
    });
}

// function throttlePublish({callback, delay}: Params) {
//     let lastTime = 0;
//     return function (...args: any) {
//         let now = Date.now();
//         if (now - lastTime >= delay) {
//             callback.apply(this, args);
//             lastTime = now;
//         }
//     };
// }