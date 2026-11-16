import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import {
  DocumentoCatalogado,
  ResultadoIngestao,
  TrechoDocumento,
} from "./tipos";

const EXTENSOES = new Set([".txt", ".md"]);
const LIMITE_TRECHO = 1200;

@Injectable()
export class IngestaoService {
  private readonly diretorioFontes =
    process.env.RAG_SOURCE_DIR ?? "/app/base-conhecimento";

  private readonly diretorioSaida =
    process.env.RAG_OUTPUT_DIR ?? "/app/data/rag";

  async executar(): Promise<ResultadoIngestao> {
    await mkdir(this.diretorioSaida, { recursive: true });

    const catalogoAnterior = await this.carregarCatalogo();
    const porOrigem = new Map(
      catalogoAnterior.map((item) => [item.origem, item]),
    );

    const nomes = (await readdir(this.diretorioFontes)).sort();
    const documentos: DocumentoCatalogado[] = [];
    const trechos: TrechoDocumento[] = [];
    const erros: ResultadoIngestao["erros"] = [];
    let ignorados = 0;

    for (const nome of nomes) {
      const extensao = extname(nome).toLowerCase();
      if (!EXTENSOES.has(extensao)) continue;

      try {
        const caminho = join(this.diretorioFontes, nome);
        const bruto = await readFile(caminho, "utf8");
        const texto = this.normalizar(bruto);
        const checksum = this.hash(texto);
        const anterior = porOrigem.get(nome);

        if (anterior?.checksum === checksum) {
          ignorados += 1;
        }

        const documentoId = this.hash(nome).slice(0, 16);
        const partes = this.segmentar(texto);

        documentos.push({
          id: documentoId,
          titulo: parse(nome).name,
          origem: nome,
          extensao: extensao as ".txt" | ".md",
          checksum,
          processadoEm: new Date().toISOString(),
          quantidadeTrechos: partes.length,
        });

        partes.forEach((parte, ordem) => {
          trechos.push({
            id: `${documentoId}-${ordem}`,
            documentoId,
            ordem,
            texto: parte,
            origem: nome,
            titulo: parse(nome).name,
          });
        });
      } catch (error: unknown) {
        erros.push({
          origem: nome,
          mensagem:
            error instanceof Error ? error.message : "Falha desconhecida",
        });
      }
    }

    await this.salvar(documentos, trechos);

    return {
      documentosProcessados: documentos.length - ignorados,
      documentosIgnorados: ignorados,
      trechosGerados: trechos.length,
      erros,
    };
  }

  async status() {
    const documentos = await this.carregarCatalogo();

    return {
      documentos: documentos.length,
      trechos: documentos.reduce(
        (total, item) => total + item.quantidadeTrechos,
        0,
      ),
      fontes: documentos.map((item) => ({
        titulo: item.titulo,
        origem: item.origem,
        quantidadeTrechos: item.quantidadeTrechos,
        processadoEm: item.processadoEm,
      })),
    };
  }

  private normalizar(texto: string): string {
    return texto
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  private segmentar(texto: string): string[] {
    const paragrafos = texto
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    const resultado: string[] = [];
    let atual = "";

    for (const paragrafo of paragrafos) {
      if (paragrafo.length > LIMITE_TRECHO) {
        if (atual) resultado.push(atual);
        resultado.push(...this.dividirTextoLongo(paragrafo));
        atual = "";
        continue;
      }

      const candidato = atual ? `${atual}\n\n${paragrafo}` : paragrafo;

      if (candidato.length <= LIMITE_TRECHO) {
        atual = candidato;
      } else {
        resultado.push(atual);
        atual = paragrafo;
      }
    }

    if (atual) resultado.push(atual);
    return resultado;
  }

  private dividirTextoLongo(texto: string): string[] {
    const palavras = texto.split(/\s+/);
    const partes: string[] = [];
    let atual = "";

    for (const palavra of palavras) {
      const candidato = atual ? `${atual} ${palavra}` : palavra;
      if (candidato.length > LIMITE_TRECHO && atual) {
        partes.push(atual);
        atual = palavra;
      } else {
        atual = candidato;
      }
    }

    if (atual) partes.push(atual);
    return partes;
  }

  private hash(valor: string): string {
    return createHash("sha256").update(valor).digest("hex");
  }

  private async carregarCatalogo(): Promise<DocumentoCatalogado[]> {
    try {
      const conteudo = await readFile(
        join(this.diretorioSaida, "documentos.json"),
        "utf8",
      );
      return JSON.parse(conteudo) as DocumentoCatalogado[];
    } catch {
      return [];
    }
  }

  private async salvar(
    documentos: DocumentoCatalogado[],
    trechos: TrechoDocumento[],
  ): Promise<void> {
    await writeFile(
      join(this.diretorioSaida, "documentos.json"),
      JSON.stringify(documentos, null, 2),
      "utf8",
    );

    const jsonl = trechos.map((trecho) => JSON.stringify(trecho)).join("\n");

    await writeFile(
      join(this.diretorioSaida, "trechos.jsonl"),
      jsonl ? `${jsonl}\n` : "",
      "utf8",
    );
  }
}
