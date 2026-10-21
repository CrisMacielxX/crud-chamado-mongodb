import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Ticket from "./Ticket.js";

dotenv.config();

const app = express()
const PORT = 1998
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Conectado com o MONGODB")
    } catch (error) {
        console.log("Erro ao conectar o MONGODB ", error)
    }
}

app.post("/tickets", async (req, res) => {
    try {
        const chamadoNovo = await Ticket.create(req.body)
        res.json(chamadoNovo)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets", async (req, res) => {
    try {
        const chamados = await Ticket.find()
        res.json(chamados)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/:id", async (req, res) => {
    try {
        const chamadoId = await Ticket.findById(req.params.id);
        res.json(chamadoId)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.put("/tickets/:id", async (req, res) => {
    try {
        const chamadoAtualizado = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body
        )
        res.json(chamadoAtualizado)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.delete("/tickets/:id", async (req, res) => {
    try {
        const chamadoDeletado = await Ticket.findByIdAndDelete(req.params.id)
        res.json(chamadoDeletado)
    } catch (error) {
        res.json({ error: error.message })
    }
})
connectDB()

app.get("/tickets/open", async (req, res) => {
    try {
        const chamadoAberto = await Ticket.find()
        res.json(chamadoAberto)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.listen(PORT, () =>
    console.log("O servidor está rodando na porta: ", PORT))