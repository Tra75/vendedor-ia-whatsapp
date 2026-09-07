// ============================================================
// REBECA — SECRETÁRIA DIGITAL DO LUCAS
// NÍVEL 1 → Regras e catálogo
// NÍVEL 2 → Qualificação e transferência
// NÍVEL 3 → Estrutura preparada para IA, CRM e WhatsApp
// ============================================================


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const CONFIG = {
  vendedor: "Lucas",

  transferencia:
    "Entendi! 😊 Vou encaminhar seu atendimento para o Lucas, que poderá verificar essa informação e continuar o atendimento com você. Só um instante, por favor.",

  transferenciaVenda:
    "Perfeito! 😊 Vou passar seu atendimento para o Lucas finalizar essa parte com você. Só um instante, por favor."
};


// ============================================================
// CATÁLOGO DE PRODUTOS
// ============================================================

const produtos = [
  {
    id: 1,
    nome: "Climatizador Ultra Ar 75L",
    categoria: "climatizador",
    preco: 1100,
    disponivel: true,
    descricao:
      "Climatizador Ultra Ar com capacidade de 75 litros.",
    pagamento:
      "Cartão de crédito em até 10x sem acréscimo ou crediário da loja em até 11x."
  }
];


// ============================================================
// CATEGORIAS AINDA NÃO CADASTRADAS
// ============================================================

const produtosNaoCadastrados = [
  "tv",
  "televisão",
  "televisao",
  "smart tv",
  "geladeira",
  "freezer",
  "sofá",
  "sofa",
  "guarda-roupa",
  "guarda roupa",
  "roupeiro",
  "armário",
  "armario",
  "mesa",
  "cadeira",
  "rack",
  "painel",
  "cama",
  "fogão",
  "fogao",
  "micro-ondas",
  "microondas",
  "máquina de lavar",
  "maquina de lavar",
  "lavadora",
  "estante"
];


// ============================================================
// SAUDAÇÃO
// ============================================================

function obterSaudacao() {

  // Horário do Brasil
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      hour12: false
    }).format(new Date())
  );

  if (hora >= 5 && hora < 12) {
    return "Bom dia!";
  }

  if (hora >= 12 && hora < 18) {
    return "Boa tarde!";
  }

  return "Boa noite!";
}


// ============================================================
// NORMALIZAÇÃO DE TEXTO
// ============================================================

function normalizarTexto(texto) {

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}


// ============================================================
// LOCALIZAR PRODUTO
// ============================================================

function encontrarProduto(texto) {

  const textoNormalizado = normalizarTexto(texto);

  return produtos.find(produto => {

    const nome = normalizarTexto(produto.nome);
    const categoria = normalizarTexto(produto.categoria);

    return (
      textoNormalizado.includes(nome) ||
      textoNormalizado.includes(categoria)
    );
  });
}


// ============================================================
// VERIFICAR PRODUTO NÃO CADASTRADO
// ============================================================

function possuiProdutoNaoCadastrado(texto) {

  const textoNormalizado = normalizarTexto(texto);

  return produtosNaoCadastrados.some(produto =>
    textoNormalizado.includes(normalizarTexto(produto))
  );
}


// ============================================================
// TRANSFERÊNCIA PARA O LUCAS
// ============================================================

function encaminharParaLucas(tipo = "normal") {

  if (tipo === "venda") {
    return CONFIG.transferenciaVenda;
  }

  return CONFIG.transferencia;
}


// ============================================================
// DETECTAR INTENÇÃO
// ============================================================

function detectarIntencao(texto) {

  const mensagem = normalizarTexto(texto);

  if (
    mensagem.includes("oi") ||
    mensagem.includes("ola") ||
    mensagem.includes("bom dia") ||
    mensagem.includes("boa tarde") ||
    mensagem.includes("boa noite")
  ) {
    return "saudacao";
  }

  if (
    mensagem.includes("preco") ||
    mensagem.includes("valor") ||
    mensagem.includes("quanto custa") ||
    mensagem.includes("quanto ta") ||
    mensagem.includes("quanto esta")
  ) {
    return "preco";
  }

  if (
    mensagem.includes("parcelamento") ||
    mensagem.includes("parcelar") ||
    mensagem.includes("parcelado") ||
    mensagem.includes("parcelas") ||
    mensagem.includes("sem entrada") ||
    mensagem.includes("entrada")
  ) {
    return "parcelamento";
  }

  if (
    mensagem.includes("pagamento") ||
    mensagem.includes("forma de pagamento") ||
    mensagem.includes("como posso pagar") ||
    mensagem.includes("como paga")
  ) {
    return "pagamento";
  }

  if (
    mensagem.includes("desconto") ||
    mensagem.includes("menor preco") ||
    mensagem.includes("faz por") ||
    mensagem.includes("consegue fazer") ||
    mensagem.includes("negociar")
  ) {
    return "negociacao";
  }

  if (
    mensagem.includes("entrega") ||
    mensagem.includes("entregam") ||
    mensagem.includes("entregar") ||
    mensagem.includes("frete")
  ) {
    return "entrega";
  }

  if (
    mensagem.includes("tem disponivel") ||
    mensagem.includes("disponibilidade") ||
    mensagem.includes("tem em estoque") ||
    mensagem.includes("tem estoque")
  ) {
    return "estoque";
  }

  if (
    mensagem.includes("quero comprar") ||
    mensagem.includes("vou comprar") ||
    mensagem.includes("quero esse") ||
    mensagem.includes("pode separar") ||
    mensagem.includes("quero fechar") ||
    mensagem.includes("vamos fechar")
  ) {
    return "compra";
  }

  if (
    mensagem.includes("oferta") ||
    mensagem.includes("ofertas") ||
    mensagem.includes("promocao")
  ) {
    return "ofertas";
  }

  return "outro";
}


// ============================================================
// QUALIFICAÇÃO DO LEAD
// ============================================================

function qualificarLead(texto) {

  const mensagem = normalizarTexto(texto);

  let temperatura = "frio";

  if (
    mensagem.includes("quero comprar") ||
    mensagem.includes("vou comprar") ||
    mensagem.includes("quero fechar") ||
    mensagem.includes("pode separar") ||
    mensagem.includes("vamos fechar")
  ) {
    temperatura = "quente";
  }

  else if (
    mensagem.includes("preco") ||
    mensagem.includes("valor") ||
    mensagem.includes("quanto custa") ||
    mensagem.includes("parcelar") ||
    mensagem.includes("parcelamento") ||
    mensagem.includes("desconto")
  ) {
    temperatura = "morno";
  }

  return {
    temperatura,
    interesse: detectarIntencao(texto)
  };
}


// ============================================================
// MEMÓRIA BÁSICA DO LEAD
// ============================================================

function criarLead(mensagem, nomeCliente = "") {

  const produto = encontrarProduto(mensagem);
  const qualificacao = qualificarLead(mensagem);

  return {
    nome: nomeCliente || null,

    mensagemInicial: mensagem,

    produtoInteresse: produto
      ? produto.nome
      : null,

    categoria:
      produto
        ? produto.categoria
        : null,

    temperatura:
      qualificacao.temperatura,

    intencao:
      qualificacao.interesse,

    precisaHumano:
      false,

    criadoEm:
      new Date().toISOString()
  };
}


// ============================================================
// RESPOSTA SOBRE PRODUTO
// ============================================================

function responderProduto(produto) {

  return `Claro! 😊

🛍️ ${produto.nome}

💰 Valor: R$ ${produto.preco.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  })}

💳 ${produto.pagamento}

${produto.descricao}

Se quiser, posso te orientar sobre as formas de pagamento ou encaminhar seu atendimento para o Lucas.`;
}


// ============================================================
// PROCESSAMENTO PRINCIPAL
// ============================================================

function processarMensagem(mensagem, nomeCliente = "") {

  if (!mensagem || typeof mensagem !== "string") {

    return "Desculpe, não consegui entender sua mensagem. Pode me enviar novamente? 😊";
  }

  const texto = normalizarTexto(mensagem);

  const saudacao = obterSaudacao();

  const nome = nomeCliente
    ? `, ${nomeCliente}`
    : "";

  const intencao = detectarIntencao(texto);

  const produto = encontrarProduto(texto);


  // ==========================================================
  // 1. SAUDAÇÃO
  // ==========================================================

  if (intencao === "saudacao") {

    return `${saudacao}${nome} 😊 Eu sou a Rebeca, secretária digital do Lucas.

É um prazer falar com você!

Como posso te ajudar hoje?

🛋️ Produtos
💰 Preços
💳 Formas de pagamento
🔥 Ofertas

Se preferir, é só me dizer o que você está procurando.`;
  }


  // ==========================================================
  // 2. PRODUTO NÃO CADASTRADO
  // ==========================================================

  if (possuiProdutoNaoCadastrado(texto)) {

    return encaminharParaLucas();
  }


  // ==========================================================
  // 3. PRODUTO CONHECIDO
  // ==========================================================

  if (produto) {

    if (
      intencao === "preco" ||
      intencao === "outro"
    ) {

      return responderProduto(produto);
    }

    if (intencao === "compra") {

      return encaminharParaLucas("venda");
    }

    if (intencao === "estoque") {

      return "Vou confirmar a disponibilidade desse produto com o Lucas para você. Só um instante, por favor. 😊";
    }

    if (intencao === "entrega") {

      return "Vou confirmar as condições de entrega desse produto com o Lucas para você. Só um instante, por favor. 😊";
    }

    if (intencao === "negociacao") {

      return encaminharParaLucas("venda");
    }

    if (
      intencao === "pagamento" ||
      intencao === "parcelamento"
    ) {

      return `Claro! 😊

Para o ${produto.nome} temos:

💳 Cartão de crédito: até 10x sem acréscimo.

🏪 Crediário da loja: até 11x.

Também pode existir a possibilidade de parcelamento sem entrada, dependendo das condições.

Se quiser fechar a compra, posso encaminhar seu atendimento para o Lucas.`;
    }

    return responderProduto(produto);
  }


  // ==========================================================
  // 4. PAGAMENTO
  // ==========================================================

  if (
    intencao === "pagamento" ||
    intencao === "parcelamento"
  ) {

    return `Claro! 😊 Temos algumas opções:

💳 Cartão de crédito: até 10x sem acréscimo.

🏪 Crediário da loja: até 11x.

Também existe a possibilidade de parcelamento sem entrada, dependendo das condições do produto.

Se você me disser qual produto está procurando, posso verificar o que consigo te informar.`;
  }


  // ==========================================================
  // 5. NEGOCIAÇÃO
  // ==========================================================

  if (intencao === "negociacao") {

    return encaminharParaLucas("venda");
  }


  // ==========================================================
  // 6. COMPRA
  // ==========================================================

  if (intencao === "compra") {

    return encaminharParaLucas("venda");
  }


  // ==========================================================
  // 7. ESTOQUE
  // ==========================================================

  if (intencao === "estoque") {

    return encaminharParaLucas();
  }


  // ==========================================================
  // 8. ENTREGA
  // ==========================================================

  if (intencao === "entrega") {

    return "Posso te ajudar com isso 😊 Vou encaminhar seu atendimento para o Lucas verificar as condições de entrega para sua região. Só um instante, por favor.";
  }


  // ==========================================================
  // 9. OFERTAS
  // ==========================================================

  if (intencao === "ofertas") {

    return `🔥 Temos algumas condições especiais disponíveis!

Me diga qual tipo de produto você está procurando e posso verificar as opções que tenho cadastradas.

Se for um produto que ainda não tenho no catálogo, encaminharei seu atendimento para o Lucas. 😊`;
  }


  // ==========================================================
  // 10. PREÇO SEM PRODUTO
  // ==========================================================

  if (intencao === "preco") {

    return "Claro! 😊 Qual produto você gostaria de consultar o preço?";
  }


  // ==========================================================
  // 11. RESPOSTA PADRÃO
  // ==========================================================

  return `Entendi 😊

Posso te ajudar com produtos, preços, formas de pagamento e condições de parcelamento.

Me conte o que você está procurando e vamos encontrar a melhor opção para você.`;
}


// ============================================================
// ESTRUTURA PARA FUTURA IA
// ============================================================

async function processarComIA(mensagem, contexto = {}) {

  /*
    FUTURO NÍVEL 3

    Aqui poderemos conectar:

    - Gemini
    - OpenAI
    - Claude
    - n8n
    - Banco de produtos
    - CRM
    - Evolution API
    - WhatsApp

    A IA poderá interpretar mensagens complexas
    e usar o catálogo como fonte de informação.

    Por enquanto, usamos o sistema de regras.
  */

  return processarMensagem(
    mensagem,
    contexto.nomeCliente || ""
  );
}


// ============================================================
// EXPORTAÇÃO
// ============================================================

module.exports = {

  processarMensagem,

  processarComIA,

  encontrarProduto,

  detectarIntencao,

  qualificarLead,

  criarLead,

  obterSaudacao
};
