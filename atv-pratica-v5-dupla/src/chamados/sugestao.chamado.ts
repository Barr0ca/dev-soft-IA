import { SUGESTAO_CONSTANTS } from "./constants/sugestao.constants";
import { SugestaoResposta } from "./interfaces/sugestao.interface";

function textoLimitado(
  valor: unknown,
  minimo: number,
  maximo: number,
): string | null {
  if (typeof valor != "string") {
    return null;
  }
  const texto = valor.trim();
  if (texto.length < minimo || texto.length > maximo) {
    return null;
  }
  return texto;
}

function lerInformacoes(valor: unknown): string[] | null {
  if (
    !Array.isArray(valor) ||
    valor.length > SUGESTAO_CONSTANTS.INFO_MAX_ITENS
  ) {
    return null;
  }
  const informacoes: string[] = [];
  for (const item of valor) {
    const informacao = textoLimitado(
      item,
      SUGESTAO_CONSTANTS.INFO_MIN,
      SUGESTAO_CONSTANTS.INFO_MAX,
    );
    if (!informacao) {
      return null;
    }
    informacoes.push(informacao);
  }
  return informacoes;
}

function apareceForaDoChamado(
  saida: string,
  chamado: string,
  expressao: RegExp,
): boolean {
  const flags = expressao.flags.includes("g")
    ? expressao.flags
    : `${expressao.flags}g`;
  const busca = new RegExp(expressao.source, flags);
  for (const encontrado of saida.matchAll(busca)) {
    if (!chamado.includes(encontrado[0])) {
      return true;
    }
  }
  return false;
}

function repeteSegredo(saida: string, chamado: string): boolean {
  const encontro = chamado.match(
    /(?:senha|token|c[oó]digo)\s*(?:é|e|:)\s*([^\s,.;]+)/i,
  );
  const segredo = encontro?.[1];
  if (!segredo) {
    return false;
  }
  return saida.toLowerCase().includes(segredo.toLowerCase());
}

function conteudoPermitido(saida: string, chamado: string): boolean {
  if (
    SUGESTAO_CONSTANTS.PEDIDO_SEGREDO.test(saida) ||
    repeteSegredo(saida, chamado)
  ) {
    return false;
  }
  if (
    SUGESTAO_CONSTANTS.DECISAO_SEM_AUTORIZACAO.some((regra) =>
      regra.test(saida),
    )
  ) {
    return false;
  }
  if (
    apareceForaDoChamado(saida, chamado, SUGESTAO_CONSTANTS.URL) ||
    apareceForaDoChamado(saida, chamado, SUGESTAO_CONSTANTS.EMAIL) ||
    apareceForaDoChamado(saida, chamado, SUGESTAO_CONSTANTS.TELEFONE)
  ) {
    return false;
  }
  return true;
}

export function interpretarSugestao(
  resposta: string,
  textoChamado: string,
): SugestaoResposta | null {
  let bruto: unknown;
  try {
    bruto = JSON.parse(resposta.trim()) as unknown;
  } catch {
    return null;
  }
  if (typeof bruto !== "object" || bruto === null || Array.isArray(bruto)) {
    return null;
  }
  const dados = bruto as Record<string, unknown>;
  const chaves = Object.keys(dados);
  if (chaves.some((chave) => !SUGESTAO_CONSTANTS.CHAVES_PERMITIDAS.has(chave))) {
    return null;
  }
  if ("revisaoHumana" in dados && typeof dados.revisaoHumana !== "boolean") {
    return null;
  }
  const rascunho = textoLimitado(dados.rascunho, SUGESTAO_CONSTANTS.RASCUNHO_MIN, SUGESTAO_CONSTANTS.RASCUNHO_MAX);
  const informacoesAdicionais = lerInformacoes(dados.informacoesAdicionais);
  if (!rascunho || !informacoesAdicionais) {
    return null;
  }
  const saida = [rascunho, ...informacoesAdicionais].join("\n");
  if (!conteudoPermitido(saida, textoChamado)) {
    return null;
  }
  return {
    rascunho,
    informacoesAdicionais,
  };
}
