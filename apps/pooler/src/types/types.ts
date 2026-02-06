export type ticketData ={
    e: string,
    E: number,
    s:string,
    t:number,
    p:string,
    q:string,
    T:number,
    m:boolean,
    M:boolean
  }

  export interface ProcessedTrade{
    symbol: string;
    askPrice: number;
    bidPrice: number;
    timestamp: number;
  }