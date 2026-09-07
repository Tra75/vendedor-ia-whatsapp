const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    sistema: "Vendedor IA WhatsApp",
    mensagem: "Assistente de vendas iniciado com sucesso!"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
