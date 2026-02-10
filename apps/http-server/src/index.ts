import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());


app.post("api/v1/signup", async (req, res) => {
    // Signup Logic
});


app.post("api/v1/signin", async (req, res) => {
    // SignIn Logic
});


app.get("api/v1/balance", async (req, res) => {
    // logix for fetching balance of user
});


app.post("api/v1/order", async (req, res) => {
    // logic tobuy and sell BTC or etc
});


app.get("api/v1/klines", async (req, res) => {
    // logic for chart history
});

app.listen(3001);