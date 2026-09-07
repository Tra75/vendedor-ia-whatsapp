function processarMensagem(mensagem) {
  const texto = mensagem.toLowerCase().trim();

  if (texto.includes("climatizador")) {
    return "Temos o Climatizador Ultra Ar 75L por R$ 1.100. Você pode pagar no cartão em até 10x ou no crediário em até 11x. Quer saber mais?";
  }

  if (texto.includes("preço") || texto.includes("preco") || texto.includes("valor")) {
    return "Claro! Qual produto você gostaria de consultar o preço?";
  }

  if (texto.includes("oi") || texto.includes("olá") || texto.includes("ola")) {
    return "Olá! 👋 Sou o assistente virtual de vendas. Posso te ajudar com móveis, colchões, climatizadores e ofertas. O que você está procurando?";
  }

  return "Entendi! 😊 Me diga qual produto você está procurando e vou te ajudar.";
}

module.exports = { processarMensagem };
