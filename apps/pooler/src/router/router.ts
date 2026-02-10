import { client } from "..";
import { ticketData, ProcessedTrade } from "../types/types";

const lastPublishedTimes: Record<string, number> = {};
const throttleDelay = 200;
const marginRate = 0.0005;

function mapTradeData(data: ticketData): ProcessedTrade {
    const currentPrice = Number(data.p);
    return {
        symbol: data.s,
        askPrice: currentPrice + (currentPrice * marginRate),
        bidPrice: currentPrice - (currentPrice * marginRate),
        timestamp: data.E
    }
}

export async function publishToRedisChannel (data: ticketData){
    const trade = mapTradeData(data);
    const now = Date.now();
    const symbol = trade.symbol;
    console.log(symbol);
    // const lastTime = lastPublishedTimes[trade.symbol] || 0;

    if(lastPublishedTimes[symbol] && (now - lastPublishedTimes[symbol] < throttleDelay)){
        return;
    }

    lastPublishedTimes[symbol] = now;

    const channel = trade.symbol.replace("USDT", "");

    try{
        await client.publish(`ticker.${channel}`, JSON.stringify(trade));

        await client.hSet(`asset:${trade.symbol}`, {
            name: trade.symbol.toUpperCase(),
            askPrice: trade.askPrice.toString(),
            bidPrice: trade.bidPrice.toString(),
            lastUpdate: trade.timestamp.toString()
        })

        console.log(`[${trade.symbol}] published & cached`);
    }catch(e){
        console.error("Redis error", e);
    }
}