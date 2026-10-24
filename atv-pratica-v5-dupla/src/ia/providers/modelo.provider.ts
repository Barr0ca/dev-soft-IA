export type ModeloRole = 'system' | 'user' | 'assistant';

export interface ModeloMensagem {
  role: ModeloRole;
  content: string;
}

export interface ConversarInput {
  messages: ModeloMensagem[];
}

export interface GerarRespostaInput {
  mensagem: string;
}

export interface GerarRespostaOutput {
  resposta: string;
  modelo: string;
  tokensEntrada?: number;
  tokensSaida?: number;
}

export interface GerarStreamInput {
  mensagem: string;
  signal?: AbortSignal;
}

export interface ModeloProvider {
  gerar(input: GerarRespostaInput): Promise<GerarRespostaOutput>;
  gerarStream(input: GerarStreamInput): AsyncIterable<string>;
  conversar(input: ConversarInput): Promise<GerarRespostaOutput>;
  analisarArquivo(input: AnalisarArquivoInput): Promise<AnalisarArquivoOutput>;
}

export abstract class OllamaProvider {
  abstract gerar(input: GerarRespostaInput): Promise<GerarRespostaOutput>;

  abstract gerarStream(input: GerarStreamInput): AsyncIterable<string>;

  abstract analisarArquivo(
    input: AnalisarArquivoInput,
  ): Promise<AnalisarArquivoOutput>;
  
  abstract conversar(input: ConversarInput): Promise<GerarRespostaOutput>;
}

export interface AnalisarArquivoInput {
  prompt: string;
  imagemBase64?: string;
  textoDocumento?: string;
}

export interface AnalisarArquivoOutput {
  resposta: string;
  modelo: string;
  tokensEntrada?: number;
  tokensSaida?: number;
}

export const MODELO_PROVIDER = Symbol('MODELO_PROVIDER');