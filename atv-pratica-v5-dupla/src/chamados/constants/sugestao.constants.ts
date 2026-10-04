export const SUGESTAO_CONSTANTS = {
  RASCUNHO_MIN: 40,
  RASCUNHO_MAX: 800,
  INFO_MIN: 10,
  INFO_MAX: 180,
  INFO_MAX_ITENS: 3,

  CHAVES_PERMITIDAS: new Set([
    "rascunho",
    "informacoesAdicionais",
    "revisaoHumana",
  ]),

  PEDIDO_SEGREDO:
    /(?:^|[.!?]\s*)(?:informe|envie|digite|confirme|mande|compartilhe)(?: a| sua| o| seu)? (?:senha|token|pin|cvv)\b|qual (?:é|e) (?:a |o )?(?:sua |seu )?(?:senha|token)\b|precis\w* (?:da|do) (?:sua |seu )?(?:senha|token)\b|c[oó]digo de (?:autentica[cç][aã]o|verifica[cç][aã]o|seguran[cç]a)/i,

  DECISAO_SEM_AUTORIZACAO: [
    /reembolso (?:ser[áa]|foi|est[áa]) (?:aprovad|realizad|efetuad|garantid)/i,
    /aprovamos (?:o |seu |a )?(?:reembolso|acesso|solicita)/i,
    /acesso (?:ser[áa]|foi|est[áa]) (?:liberado|aprovado|concedido)/i,
    /liberamos (?:o |seu )?acesso/i,
    /prazo de \d+/i,
    /em at[ée] \d+\s*(?:hora|dia|semana|m[eê]s)/i,
    /(?:ser[áa]|foi) resolvid[oa]/i,
    /j[áa] (?:resolvemos|solucionamos)/i,
    /problema j[áa] (?:foi )?(?:resolvid|solucionad)/i,
    /(?:est[áa]|foi) aprovad[oa]/i,
  ],

  URL: /https?:\/\/\S+|www\.\S+/gi,
  EMAIL: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  TELEFONE: /\(\d{2}\)\s*\d{4,5}-?\d{4}/gi,
} as const;
