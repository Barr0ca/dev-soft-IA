import { buildResumoPrompt } from "./resumo.prompt";

describe("buildResumoPrompt", () => {
  it("inclui o chamado entre delimitadores", () => {
    const prompt = buildResumoPrompt("Não consigo emitir o boleto.");

    expect(prompt).toContain(
      "<chamado>\nNão consigo emitir o boleto.\n</chamado>",
    );
  });

  it("declara os limites e a proibição de inventar fatos", () => {
    const prompt = buildResumoPrompt("Preciso de ajuda.");

    expect(prompt).toContain("no máximo 80 caracteres");
    expect(prompt).toContain("entre 40 e 300 caracteres");
    expect(prompt).toContain("no máximo 3 pontos");
    expect(prompt).toContain("Não invente nomes, datas, sistemas");
    expect(prompt).toContain("Preserve negações");
    expect(prompt).toContain("revisaoHumana");
  });
});
