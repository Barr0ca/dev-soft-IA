export interface ResumoChamado {
  titulo: string;
  resumo: string;
  pontosImportantes: string[];
  revisaoHumana: boolean;
}

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

function lerPontos(valor: unknown): string[] | null {
  if (!Array.isArray(valor) || valor.length > 3) {
    return null;
  }

  const pontos: string[] = [];

  for (const item of valor) {
    const ponto = textoLimitado(item, 1, 200);
    if (!ponto) {
      return null;
    }
    pontos.push(ponto);
  }

  return pontos;
}

export function interpretarResumo(resposta: string): ResumoChamado | null {
  let bruto: unknown;

  try {
    bruto = JSON.parse(resposta.trim()) as unknown;
  } catch {
    return null;
  }

  const dados = bruto as Record<string, unknown>;
  const titulo = textoLimitado(dados.titulo, 1, 80);
  const resumo = textoLimitado(dados.resumo, 40, 300);
  const pontosImportantes = lerPontos(dados.pontosImportantes);

  if (!titulo || !resumo || !pontosImportantes) {
    return null;
  }

  if (typeof dados.revisaoHumana !== "boolean") {
    return null;
  }

  return {
    titulo,
    resumo,
    pontosImportantes,
    revisaoHumana: dados.revisaoHumana,
  };
}
