import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
    {
        titulo: String,
        descricao: String,
        solicitante: String,
        categoria: String,
        prioridade: String,
        status: String,
        dataAbertura: {
            type: Date,
            default: Date.now
        }

    },
    { collection: "tickets" }
);

export default mongoose.model("tickets", TicketSchema)