export interface DocumentoCatalogado {
  id: string;
  titulo: string;
  origem: string;
  extensao: ".txt" | ".md";
  checksum: string;
  processadoEm: string;
  quantidadeTrechos: number;
}

export interface TrechoDocumento {
  id: string;
  documentoId: string;
  ordem: number;
  texto: string;
  origem: string;
  titulo: string;
}

export interface ResultadoIngestao {
  documentosProcessados: number;
  documentosIgnorados: number;
  trechosGerados: number;
  erros: Array<{
    origem: string;
    mensagem: string;
  }>;
}
