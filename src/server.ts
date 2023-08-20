import express from "express";
import { app } from "./routes/routes";
const rota = express()


rota.use(express.json())
rota.use(app)

rota.listen(3333, () => { console.log('Estamos ON') });


