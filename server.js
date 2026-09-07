const express = require("express");
const { processarMensagem } = require("./webhook");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

app.get("/", (req, res) => {
  res.json({
    status: "online",
    sistema: "Rebeca - Assistente Virtual de Vendas",
    mensagem: "Oi! Sou a Rebeca, assistente virtual de vendas do Lucas 😊 Como posso te ajudar?"
  });
});

app.post("/mensagem", (req, res) => {
  const mensagem = req.body.mensagem;

  if (!mensagem) {
    return res.status(400).json({
      erro: "Envie uma mensagem."
    });
  }

  const resposta = processarMensagem(mensagem);

  res.json({
    mensagemRecebida: mensagem,
    resposta: resposta
  });
});

app.listen(PORT, () => {
  console.log(`Rebeca rodando na porta ${PORT}`);
});
