const express = require("express");
const { Pool } = require("pg");
const { processarMensagem } = require("./webhook");

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// Criar as tabelas automaticamente
async function prepararBanco() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        identificador VARCHAR(255) UNIQUE NOT NULL,
        nome VARCHAR(255),
        produto_procurado VARCHAR(255),
        cpf_enviado BOOLEAN DEFAULT FALSE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversas (
        id SERIAL PRIMARY KEY,
        identificador VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        resposta TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        identificador VARCHAR(255),
        valor NUMERIC(10,2) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS metricas_diarias (
        id SERIAL PRIMARY KEY,
        data DATE UNIQUE NOT NULL,
        interacoes INTEGER DEFAULT 0,
        novos_clientes INTEGER DEFAULT 0,
        leads_quentes INTEGER DEFAULT 0,
        orcamentos INTEGER DEFAULT 0,
        cpfs_enviados INTEGER DEFAULT 0,
        vendas INTEGER DEFAULT 0,
        valor_total NUMERIC(10,2) DEFAULT 0
      );
    `);

    console.log("Banco de dados preparado com sucesso!");
  } catch (erro) {
    console.error("Erro ao preparar banco:", erro);
  }
}

app.use(express.json());
app.use(express.static("."));

app.get("/", (req, res) => {
  res.json({
    status: "online",
    sistema: "Rebeca - Assistente Virtual de Vendas",
    mensagem:
      "Oi! Sou a Rebeca, assistente virtual de vendas do Lucas 😊 Como posso te ajudar?"
  });
});

app.post("/mensagem", async (req, res) => {
  try {
    const mensagem = req.body.mensagem;

    if (!mensagem) {
      return res.status(400).json({
        erro: "Envie uma mensagem."
      });
    }

    const identificador = req.body.identificador || "cliente";

    const resposta = processarMensagem(
      mensagem,
      "",
      identificador
    );

    // Salvar a conversa
    await pool.query(
      `
      INSERT INTO conversas
      (identificador, mensagem, resposta)
      VALUES ($1, $2, $3)
      `,
      [identificador, mensagem, resposta]
    );

    res.json({
      mensagemRecebida: mensagem,
      resposta: resposta,
      banco: "conversa salva com sucesso"
    });
  } catch (erro) {
    console.error("Erro ao processar mensagem:", erro);

    res.status(500).json({
      erro: "Erro interno ao processar mensagem."
    });
  }
});

// Preparar banco antes de iniciar o servidor
prepararBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`Rebeca rodando na porta ${PORT}`);
  });
});
