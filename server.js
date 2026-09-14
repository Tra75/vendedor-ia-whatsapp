// ============================================================
// REBECA — SERVIDOR PRINCIPAL
//
// Responsabilidades:
// - Gerenciar conexão com PostgreSQL
// - Receber e processar mensagens
// - Salvar histórico de conversas
// - Servir interface de teste
// ============================================================

const express = require("express");
const { Pool } = require("pg");
const { processarMensagem } = require("./webhook");

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const app = express();
const PORT = process.env.PORT || 3000;

// Validar variáveis de ambiente críticas
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL não definida. Usando modo teste.");
}

// ============================================================
// POOL DE CONEXÃO POSTGRESQL
// ============================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
  max: 10, // máximo de conexões
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Tratamento de erros da conexão
pool.on("error", (err) => {
  console.error("Erro não esperado no pool PostgreSQL:", err);
});

pool.on("connect", () => {
  console.log("✅ Nova conexão estabelecida com PostgreSQL");
});

// ============================================================
// PREPARAR BANCO DE DADOS
// ============================================================

async function prepararBanco() {
  try {
    console.log("📦 Preparando banco de dados...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        identificador VARCHAR(255) UNIQUE NOT NULL,
        nome VARCHAR(255),
        produto_procurado VARCHAR(255),
        temperatura VARCHAR(50) DEFAULT 'frio',
        cpf_enviado BOOLEAN DEFAULT FALSE,
        contrato_fechado BOOLEAN DEFAULT FALSE,
        valor_venda NUMERIC(10,2) DEFAULT 0,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversas (
        id SERIAL PRIMARY KEY,
        identificador VARCHAR(255) NOT NULL,
        mensagem TEXT NOT NULL,
        resposta TEXT,
        intencao VARCHAR(100),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (identificador) REFERENCES clientes(identificador) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        identificador VARCHAR(255) NOT NULL,
        produto_nome VARCHAR(255),
        valor NUMERIC(10,2) NOT NULL,
        data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (identificador) REFERENCES clientes(identificador) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS metricas_diarias (
        id SERIAL PRIMARY KEY,
        data DATE UNIQUE NOT NULL,