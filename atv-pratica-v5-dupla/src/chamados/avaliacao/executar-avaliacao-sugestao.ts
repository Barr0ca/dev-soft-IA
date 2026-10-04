import { writeFile } from "node:fs/promises";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { AvaliadorSugestaoService } from "./avaliador-sugestao.service";

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  try {
    const avaliador = app.get(AvaliadorSugestaoService);
    const relatorio = await avaliador.executar();

    await writeFile(
      "resultado-avaliacao-sugestao.json",
      JSON.stringify(relatorio, null, 2),
    );

    console.table(
      relatorio.resultados.map((item) => ({
        id: item.id,
        tipo: item.tipo,
        formatoValido: item.formatoValido,
        correto: item.correto,
        erro: item.erro,
      })),
    );
    console.log({
      total: relatorio.total,
      acuracia: relatorio.acuracia,
      conformidadeFormato: relatorio.conformidadeFormato,
    });
  } finally {
    await app.close();
  }
}

void main();
