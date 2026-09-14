// ============================================================
// REBECA — SECRETÁRIA DIGITAL DO LUCAS
//
// NÍVEL 1 → Atendimento e catálogo
// NÍVEL 2 → Qualificação e transferência
// NÍVEL 3 → Métricas, CRM e relatório diário
//
// IMPORTANTE:
// Este arquivo processa mensagens, detecta intenções,
// qualifica leads e gerencia conversas com clientes.
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
      "Climatizador Ultra Ar com capacidade de 75 litros. Ideal para ambientes de até 50m². Consumo moderado de energia.",
    pagamento:
      "Cartão de crédito em até 10x sem acréscimo ou crediário da loja em até 11x.",
    imagem: null
  }

  // NOVOS PRODUTOS SERÃO ADICIONADOS AQUI
];


// ============================================================
// PRODUTOS QUE AINDA NÃO ESTÃO NO CATÁLOGO
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
// MEMÓRIA TEMPORÁRIA DOS LEADS
//
// ATENÇÃO:
// Esta memória funciona enquanto o servidor estiver rodando.
// TODO: Migrar para PostgreSQL (tabela clientes)
// ============================================================

const leads = {};


// ============================================================
// MÉTRICAS DO DIA
// ============================================================

const metricas = {
  interacoes: 0,
  novosClientes: 0,
  leadsQuentes: 0,
  orcamentos: 0,
  cpfsEnviados: 0,
  contratosFechados: 0,
  valorVendido: 0,

  produtosProcurados: {},

  data: obterDataBrasil()
};


// ============================================================
// DATA DO BRASIL
// ============================================================

function obterDataBrasil() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo"
  }).format(new Date());
}


// ============================================================
// HORÁRIO DO BRASIL
// ============================================================

function obterHoraBrasil() {
  return Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      hour12: false
    }).format(new Date())
  );
}


// ============================================================
// SAUDAÇÃO
// ============================================================

function obterSaudacao() {
  const hora = obterHoraBrasil();

  if (hora >= 5 && hora < 12) {
    return "Bom dia!";
  }

  if (hora >= 12 && hora < 18) {
    return "Boa tarde!";
  }

  return "Boa noite!";
}


// ============================================================
// NORMALIZAR TEXTO
// ============================================================

function normalizarTexto(texto) {
  if (!texto || typeof texto !== "string") {
    return "";
  }

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}


// ============================================================
// ENCONTRAR PRODUTO
// ============================================================

function encontrarProduto(texto) {
  const textoNormalizado = normalizarTexto(texto);

  if (!textoNormalizado) {
    return null;
  }

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

  if (!textoNormalizado) {
    return false;
  }

  return produtosNaoCadastrados.some(produto =>
    textoNormalizado.includes(normalizarTexto(produto))
  );
}


// ============================================================
// DETECTAR INTENÇÃO
// ============================================================

function detectarIntencao(texto) {
  const mensagem = normalizarTexto(texto);

  if (!mensagem) {
    return "outro";
  }

  // Saudações
  if (
    mensagem === "oi" ||
    mensagem === "ola" ||
    mensagem === "olá" ||
    mensagem === "bom dia" ||
    mensagem === "boa tarde" ||
    mensagem === "boa noite" ||
    mensagem === "e ai" ||
    mensagem === "opa"
  ) {
    return "saudacao";
  }

  // Preço
  if (
    mensagem.includes("preco") ||
    mensagem.includes("preço") ||
    mensagem.includes("valor") ||
    mensagem.includes("quanto custa") ||
    mensagem.includes("quanto ta") ||
    mensagem.includes("quanto esta") ||
    mensagem.includes("qual o valor") ||
    mensagem.includes("custa quanto")
  ) {
    return "preco";
  }

  // Parcelamento
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

  // Pagamento
  if (
    mensagem.includes("pagamento") ||
    mensagem.includes("forma de pagamento") ||
    mensagem.includes("como posso pagar") ||
    mensagem.includes("como paga") ||
    mensagem.includes("aceita cartao") ||
    mensagem.includes("cartao")
  ) {
    return "pagamento";
  }

  // Negociação / Desconto
  if (
    mensagem.includes("desconto") ||
    mensagem.includes("menor preco") ||
    mensagem.includes("menor preço") ||
    mensagem.includes("faz por") ||
    mensagem.includes("consegue fazer") ||
    mensagem.includes("negociar") ||
    mensagem.includes("promocao") ||
    mensagem.includes("promoção")
  ) {
    return "negociacao";
  }

  // Entrega
  if (
    mensagem.includes("entrega") ||
    mensagem.includes("entregam") ||
    mensagem.includes("entregar") ||
    mensagem.includes("frete") ||
    mensagem.includes("costo de entrega")
  ) {
    return "entrega";
  }

  // Estoque
  if (
    mensagem.includes("tem disponivel") ||
    mensagem.includes("disponibilidade") ||
    mensagem.includes("tem em estoque") ||
    mensagem.includes("tem estoque") ||
    mensagem.includes("disponivel") ||
    mensagem.includes("em estoque")
  ) {
    return "estoque";
  }

  // CPF / Análise de crédito
  if (
    mensagem.includes("cpf") ||
    mensagem.includes("analise de credito") ||
    mensagem.includes("analise do cpf") ||
    mensagem.includes("consultar meu cpf")
  ) {
    return "cpf";
  }

  // Compra / Fechamento
  if (
    mensagem.includes("quero comprar") ||
    mensagem.includes("vou comprar") ||
    mensagem.includes("quero esse") ||
    mensagem.includes("pode separar") ||
    mensagem.includes("quero fechar") ||
    mensagem.includes("vamos fechar") ||
    mensagem.includes("quero levar") ||
    mensagem.includes("vou levar")
  ) {
    return "compra";
  }

  // Ofertas
  if (
    mensagem.includes("oferta") ||
    mensagem.includes("ofertas") ||
    mensagem.includes("promocao") ||
    mensagem.includes("promoção") ||
    mensagem.includes("queima de estoque")
  ) {
    return "ofertas";
  }

  return "outro";
}


// ============================================================
// QUALIFICAR LEAD
// ============================================================

function qualificarLead(texto) {
  const mensagem = normalizarTexto(texto);

  let temperatura = "frio";

  if (
    mensagem.includes("quero comprar") ||
    mensagem.includes("vou comprar") ||
    mensagem.includes("quero fechar") ||
    mensagem.includes("pode separar") ||
    mensagem.includes("vamos fechar") ||
    mensagem.includes("quero levar")
  ) {
    temperatura = "quente";
  } else if (
    mensagem.includes("preco") ||
    mensagem.includes("preço") ||
    mensagem.includes("valor") ||
    mensagem.includes("parcelar") ||
    mensagem.includes("parcelamento") ||
    mensagem.includes("desconto") ||
    mensagem.includes("cpf")
  ) {
    temperatura = "morno";
  }

  return {
    temperatura,
    interesse: detectarIntencao(texto)
  };
}


// ============================================================
// CRIAR / ATUALIZAR LEAD
// ============================================================

function registrarLead(mensagem, nomeCliente = "", identificador = "cliente") {
  const produto = encontrarProduto(mensagem);
  const qualificacao = qualificarLead(mensagem);

  if (!leads[identificador]) {
    leads[identificador] = {
      nome: nomeCliente || null,
      produtoInteresse: produto ? produto.nome : null,
      categoria: produto ? produto.categoria : null,
      temperatura: qualificacao.temperatura,
      intencao: qualificacao.interesse,
      cpfEnviado: false,
      contratoFechado: false,
      valorVenda: 0,
      interacoes: 0,
      ultimaMensagem: mensagem,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    metricas.novosClientes++;
  } else {
    const lead = leads[identificador];
    lead.interacoes++;
    lead.ultimaMensagem = mensagem;
    lead.atualizadoEm = new Date().toISOString();

    if (produto) {
      lead.produtoInteresse = produto.nome;
      lead.categoria = produto.categoria;
    }

    lead.temperatura = qualificacao.temperatura;
    lead.intencao = qualificacao.interesse;
  }

  return leads[identificador];
}


// ============================================================
// REGISTRAR PRODUTO PROCURADO
// ============================================================

function registrarProdutoProcurado(produto) {
  if (!produto) {
    return;
  }

  const nome = produto.nome;

  if (!metricas.produtosProcurados[nome]) {
    metricas.produtosProcurados[nome] = 0;
  }

  metricas.produtosProcurados[nome]++;
}


// ============================================================
// REGISTRAR INTERAÇÃO
// ============================================================

function registrarInteracao() {
  metricas.interacoes++;
}


// ============================================================
// REGISTRAR ORÇAMENTO
// ============================================================

function registrarOrcamento() {
  metricas.orcamentos++;
}


// ============================================================
// REGISTRAR CPF PARA ANÁLISE
// ============================================================

function registrarCPF(identificador = "cliente") {
  metricas.cpfsEnviados++;

  if (leads[identificador]) {
    leads[identificador].cpfEnviado = true;
  }
}


// ============================================================
// REGISTRAR VENDA
// ============================================================

function registrarVenda(valor, identificador = "cliente") {
  const valorNumerico = Number(valor) || 0;

  metricas.contratosFechados++;
  metricas.valorVendido += valorNumerico;

  if (leads[identificador]) {
    leads[identificador].contratoFechado = true;
    leads[identificador].valorVenda = valorNumerico;
  }
}


// ============================================================
// CONTAR LEADS QUENTES
// ============================================================

function contarLeadsQuentes() {
  return Object.values(leads).filter(lead => lead.temperatura === "quente").length;
}


// ============================================================
// CALCULAR CONVERSÃO
// ============================================================

function calcularConversao() {
  if (metricas.interacoes === 0) {
    return "0%";
  }

  const taxa = (metricas.contratosFechados / metricas.interacoes) * 100;

  return `${taxa.toFixed(1)}%`;
}


// ============================================================
// OBTER PRODUTOS MAIS PROCURADOS
// ============================================================

function obterProdutosMaisProcurados() {
  const lista = Object.entries(metricas.produtosProcurados);

  if (lista.length === 0) {
    return "Nenhum produto registrado ainda.";
  }

  lista.sort((a, b) => b[1] - a[1]);

  return lista
    .slice(0, 5)
    .map(
      (item, index) =>
        `${index + 1}. ${item[0]} — ${item[1]} interação(ões)`
    )
    .join("\n");
}


// ============================================================
// OBTER LEADS QUENTES
// ============================================================

function obterLeadsQuentes() {
  const lista = Object.values(leads).filter(
    lead => lead.temperatura === "quente"
  );

  if (lista.length === 0) {
    return "Nenhum lead quente registrado.";
  }

  return lista
    .slice(0, 10)
    .map(lead => {
      const nome = lead.nome || "Cliente";
      const produto = lead.produtoInteresse || "produto não identificado";
      const cpf = lead.cpfEnviado ? "✅ CPF enviado" : "❌ CPF não enviado";

      return `• ${nome} — ${produto} — ${cpf}`;
    })
    .join("\n");
}


// ============================================================
// GERAR RESUMO DO DIA
// ============================================================

function gerarResumoDoDia() {
  metricas.leadsQuentes = contarLeadsQuentes();

  return `
📋 RESUMO DO DIA — REBECA

📅 ${metricas.data}

👥 Interações: ${metricas.interacoes}

🆕 Novos clientes: ${metricas.novosClientes}

🔥 Leads quentes: ${metricas.leadsQuentes}

💰 Orçamentos/propostas: ${metricas.orcamentos}

🪪 CPFs enviados para análise: ${metricas.cpfsEnviados}

✅ Contratos/vendas fechados: ${metricas.contratosFechados}

💵 Valor total vendido: R$ ${metricas.valorVendido.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  })}

📈 Conversão: ${calcularConversao()}


🛍️ PRODUTOS MAIS PROCURADOS

${obterProdutosMaisProcurados()}


🔥 LEADS QUENTES

${obterLeadsQuentes()}


🤖 Relatório gerado pela Rebeca.
`;
}


// ============================================================
// RESPOSTA SOBRE PRODUTO
// ============================================================

function responderProduto(produto) {
  registrarProdutoProcurado(produto);

  const preco = produto.preco.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });

  return `Claro! 😊

🛍️ ${produto.nome}

💰 Valor: R$ ${preco}

💳 ${produto.pagamento}

📝 ${produto.descricao}

Se quiser saber mais sobre as formas de pagamento ou está pronto para comprar, é só me chamar! 😊`;
}


// ============================================================
// TRANSFERÊNCIA PARA LUCAS
// ============================================================

function encaminharParaLucas(tipo = "normal") {
  if (tipo === "venda") {
    return CONFIG.transferenciaVenda;
  }

  return CONFIG.transferencia;
}


// ============================================================
// RESPOSTA: PAGAMENTO / PARCELAMENTO
// ============================================================

function responderPagamento() {
  return `Claro! 😊 Temos as seguintes opções:

💳 **Cartão de crédito:** até 10x sem acréscimo

🏪 **Crediário da loja:** até 11x

Também existe a possibilidade de parcelamento sem entrada, dependendo do produto e das condições.

Se você me dizer qual produto está procurando, posso te orientar melhor! 😊`;
}


// ============================================================
// RESPOSTA: OFERTAS
// ============================================================

function responderOfertas() {
  return `Ótimo! 😊 Nós sempre temos ofertas incríveis aqui!

No momento, temos disponível:

🎯 **Climatizador Ultra Ar 75L** — R$ 1.100,00
   (Parcelado no cartão em até 10x ou crediário em até 11x)

Deixa eu confirmar com o Lucas quais são as melhores ofertas do momento e envio para você. Só um instante! 😊

Qual produto você está procurando especificamente?`;
}


// ============================================================
// PROCESSAMENTO PRINCIPAL
// ============================================================

async function processarMensagem(
  mensagem,
  nomeCliente = "",
  identificador = "cliente",
  pool = null
) {
  // Validações básicas
  if (!mensagem || typeof mensagem !== "string") {
    return "Desculpe, não consegui entender sua mensagem. Pode me enviar novamente? 😊";
  }

  try {
    // Registrar interação
    registrarInteracao();

    // Registrar / atualizar lead
    const lead = registrarLead(mensagem, nomeCliente, identificador);

    const texto = normalizarTexto(mensagem);
    const intencao = detectarIntencao(texto);
    const produto = encontrarProduto(texto);

    // ==========================================================
    // SAUDAÇÃO
    // ==========================================================

    if (intencao === "saudacao") {
      return `${obterSaudacao()}${nomeCliente ? `, ${nomeCliente}` : ""} 😊

Eu sou a Rebeca, secretária digital do Lucas.

É um prazer falar com você!

Como posso te ajudar hoje?

🛋️ Móveis e produtos
💰 Preços
💳 Formas de pagamento
🔥 Ofertas especiais

Se preferir, é só me dizer o que você está procurando!`;
    }

    // ==========================================================
    // PRODUTO NÃO CADASTRADO
    // ==========================================================

    if (possuiProdutoNaoCadastrado(texto)) {
      lead.precisaHumano = true;

      return encaminharParaLucas();
    }

    // ==========================================================
    // PRODUTO CONHECIDO
    // ==========================================================

    if (produto) {
      // Preço
      if (intencao === "preco" || intencao === "outro") {
        registrarOrcamento();
        return responderProduto(produto);
      }

      // Compra
      if (intencao === "compra") {
        lead.temperatura = "quente";
        lead.precisaHumano = true;
        return encaminharParaLucas("venda");
      }

      // Estoque
      if (intencao === "estoque") {
        lead.precisaHumano = true;
        return "Vou confirmar a disponibilidade desse produto com o Lucas para você. Só um instante, por favor. 😊";
      }

      // Entrega
      if (intencao === "entrega") {
        lead.precisaHumano = true;
        return "Vou confirmar as condições de entrega desse produto com o Lucas para você. Só um instante, por favor. 😊";
      }

      // Negociação
      if (intencao === "negociacao") {
        lead.precisaHumano = true;
        return encaminharParaLucas("venda");
      }

      // Pagamento / Parcelamento
      if (intencao === "pagamento" || intencao === "parcelamento") {
        return `Claro! 😊

Para o **${produto.nome}** temos:

💳 Cartão de crédito: até 10x sem acréscimo.

🏪 Crediário da loja: até 11x.

Também pode existir a possibilidade de parcelamento sem entrada, dependendo das condições.

Se quiser fechar a compra, posso encaminhar seu atendimento para o Lucas! 😊`;
      }

      // Padrão: responder produto
      return responderProduto(produto);
    }

    // ==========================================================
    // CPF / ANÁLISE
    // ==========================================================

    if (intencao === "cpf") {
      registrarCPF(identificador);

      return `Claro! 😊

Para algumas opções de parcelamento, a loja pode solicitar o CPF para realizar uma análise de crédito.

Vou registrar que você deseja fazer a análise e encaminhar seu atendimento para o Lucas verificar as melhores condições para você.

Só um instante, por favor!`;
    }

    // ==========================================================
    // PAGAMENTO / PARCELAMENTO (Sem produto específico)
    // ==========================================================

    if (intencao === "pagamento" || intencao === "parcelamento") {
      return responderPagamento();
    }

    // ==========================================================
    // OFERTAS
    // ==========================================================

    if (intencao === "ofertas") {
      return responderOfertas();
    }

    // ==========================================================
    // NEGOCIAÇÃO (Sem produto específico)
    // ==========================================================

    if (intencao === "negociacao") {
      lead.precisaHumano = true;
      return encaminharParaLucas("venda");
    }

    // ==========================================================
    // COMPRA (Sem produto específico)
    // ==========================================================

    if (intencao === "compra") {
      lead.temperatura = "quente";
      lead.precisaHumano = true;
      return encaminharParaLucas("venda");
    }

    // ==========================================================
    // ESTOQUE (Sem produto específico)
    // ==========================================================

    if (intencao === "estoque") {
      lead.precisaHumano = true;
      return encaminharParaLucas();
    }

    // ==========================================================
    // ENTREGA (Sem produto específico)
    // ==========================================================

    if (intencao === "entrega") {
      lead.precisaHumano = true;
      return "Posso te ajudar com isso 😊 Vou encaminhar seu atendimento para o Lucas verificar as condições de entrega para sua região. Só um instante, por favor!";
    }

    // ==========================================================
    // PADRÃO: OUTRO
    // ==========================================================

    return `Hmm, não tenho certeza se entendi direito. 😅

Você está procurando:

🛋️ Um móvel ou produto específico?
💰 Informações sobre preços?
💳 Saber como pagar?
🔥 Conhecer nossas ofertas?

Me fala que eu tento ajudar! 😊`;
  } catch (erro) {
    console.error("Erro em processarMensagem:", erro);

    return "Desculpe, ocorreu um erro ao processar sua mensagem. Pode tentar novamente? 😊";
  }
}


// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

module.exports = {
  processarMensagem,
  gerarResumoDoDia,
  contarLeadsQuentes,
  obterProdutosMaisProcurados,
  obterLeadsQuentes,
  metricas,
  leads,
  produtos
};