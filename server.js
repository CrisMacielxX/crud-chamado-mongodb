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

app.get("/tickets/open/status", async (req, res) => {
    try {
        const chamadoAberto = await Ticket.find({
            status: "Aberto"
        })
        res.json(chamadoAberto)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/priority/:prioridade", async (req, res) => {
    try {
        const chamadoPri = await Ticket.find({
            prioridade: req.params.prioridade
        })
        res.json(chamadoPri)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/category/:categoria", async (req, res) => {
    try {
        const chamadoCat = await Ticket.find({
            categoria: req.params.categoria
        })
        res.json(chamadoCat)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.patch("/tickets/:id/status", async (req, res) => {
    try {
        const chamados = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: "Resolvido" }
        )
        res.json(chamados)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/in-progress/progress", async (req, res) => {
    try {
        const chamadoPro = await Ticket.find({
            status: "Em Andamento"
        })
        res.json(chamadoPro)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/requester/:nome", async (req, res) => {
    try {
        const chamadoNome = await Ticket.find({
            solicitante: req.params.nome
        })
        res.json(chamadoNome)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/ticket/count/total", async (req, res) => {
    try {
        const chamadoTotal = await Ticket.countDocuments()
        res.json({ TotalDeChamados: chamadoTotal })
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/resolved/count", async (req, res) => {
    try {
        const chamadoRes = await Ticket.countDocuments({
            status: "Resolvido"
        })
        res.json({ ChamadosResolvidos: chamadoRes })
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.get("/tickets/ordered/ordem", async (req, res) => {
    try {
        const chamados = await Ticket.find()
        const prioridades = {
            "Alta": 1,
            "Média": 2,
            "Baixa": 3,
        };
        chamados.sort((a, b) => {
            return prioridades[a.prioridade] - prioridades[b.prioridade];
        });
        res.json(chamados)
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.delete("/tickets/:id/delete", async (req, res) => {
    try {
        const { id } = req.params;
        const chamado = await Ticket.findById(id)
        if (!chamado) {
            res.json({ error: "Chamado não encontrado." });
        }

        if (chamado.status === "Aberto" || chamado.status === "Em andamento") {
            res.json({
                error: "Chamado não Resolvido"
            });
        }
        await Ticket.findByIdAndDelete(id);

        return res.json({ message: "Chamado excluído" });
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.listen(PORT, () =>
    console.log("O servidor está rodando na porta: ", PORT))