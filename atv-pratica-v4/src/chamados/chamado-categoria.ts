export const CHAMADO_CATEGORIAS = [
  'ACESSO',
  'FINANCEIRO',
  'MATRICULA',
  'DOCUMENTOS',
  'OUTROS',
] as const;

export type ChamadoCategoria = (typeof CHAMADO_CATEGORIAS)[number];

const ALIAS_CATEGORIA: Record<string, ChamadoCategoria> = {
  ACCESSO: 'ACESSO',
};

export function isChamadoCategoria(
  valor: string,
): valor is ChamadoCategoria {
  return CHAMADO_CATEGORIAS.includes(valor as ChamadoCategoria);
}

function removerAcentos(valor: string): string {
  return valor.normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * Normaliza a saída do modelo para uma categoria da lista fechada.
 * Não mapeia valores desconhecidos para OUTROS.
 */
export function normalizarCategoria(
  resposta: string | undefined,
): ChamadoCategoria | null {
  if (!resposta?.trim()) {
    return null;
  }

  const primeiraLinha = resposta.trim().split(/\r?\n/, 1)[0] ?? '';
  const candidata = removerAcentos(primeiraLinha)
    .replace(/^[\s`"'*[({<]+/, '')
    .replace(/[\s`"'*\])}>.;,:!?]+$/, '')
    .trim()
    .toUpperCase();

  if (isChamadoCategoria(candidata)) {
    return candidata;
  }

  return ALIAS_CATEGORIA[candidata] ?? null;
}

