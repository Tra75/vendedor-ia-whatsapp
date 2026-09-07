function obterSaudacao() {
  const hora = new Date().getHours();

  if (hora >= 5 && hora < 12) {
    return "Bom dia!";
  }

  if (hora >= 12 && hora < 18) {
    return "Boa tarde!";
  }

  return "Boa noite!";
}

function processarMensagem(mensagem, nomeCliente = "") {
  const texto = mensagem.toLowerCase().trim();
  const saudacao = obterSaudacao();

  // Saudação
  if (
    texto === "oi" ||
    texto === "olá" ||
    texto === "ola" ||
    texto === "bom dia" ||
    texto === "boa tarde" ||
    texto === "boa noite"
  ) {
    const nome = nomeCliente ? `, ${nomeCliente}` : "";

    return `${saudacao}${nome} 😊 Sou a Rebeca, secretária digital do Lucas. Como posso te ajudar hoje?`;
  }

  // Climatizador
  if (texto.includes("climatizador")) {
    return "Claro! 😊 Temos o Climatizador Ultra Ar 75L por R$ 1.100. Você pode pagar no cartão em até 10x ou no crediário em até 11x. Quer que eu te passe mais detalhes?";
  }

  // Preço
  if (
    texto.includes("preço") ||
    texto.includes("preco") ||
    texto.includes("valor")
  ) {
    return "Claro! 😊 Qual produto você gostaria de consultar o preço?";
  }

  // Formas de pagamento
  if (
    texto.includes("parcel") ||
    texto.includes("cartão") ||
    texto.includes("cartao") ||
    texto.includes("crediário") ||
    texto.includes("crediario")
  ) {
    return "Trabalhamos com cartão em até 10x e crediário em até 11x. 😊 Se você me disser qual produto deseja, posso te orientar melhor.";
  }

  // Ofertas
  if (
    texto.includes("oferta") ||
    texto.includes("promoção") ||
    texto.includes("promocao")
  ) {
    return "Temos algumas condições especiais disponíveis. 😊 Me diga qual tipo de produto você está procurando que eu verifico as opções para você.";
  }

  // Fallback
  return "Entendi! 😊 Pode me contar um pouco mais sobre o que você está procurando? Vou te ajudar da melhor forma possível.";
}

module.exports = {
  processarMensagem
};
