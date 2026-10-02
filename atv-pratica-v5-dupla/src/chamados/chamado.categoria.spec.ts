import { normalizarCategoria } from "./chamado.categoria";

describe("normalizarCategoria", () => {
  it("aceita a categoria exatamente como retornada pelo modelo", () => {
    expect(normalizarCategoria("ACESSO")).toBe("ACESSO");
  });

  it("normaliza caixa, espaços e pontuação periférica", () => {
    expect(normalizarCategoria('  "financeiro."  ')).toBe("FINANCEIRO");
  });

  it("usa somente a primeira linha da resposta", () => {
    expect(normalizarCategoria("MATRICULA\numa explicação extra")).toBe(
      "MATRICULA",
    );
  });

  it("corrige a grafia ACCESSO para a categoria permitida ACESSO", () => {
    expect(normalizarCategoria("ACCESSO")).toBe("ACESSO");
  });

  it("rejeita categoria desconhecida em vez de convertê-la em OUTROS", () => {
    expect(normalizarCategoria("TI")).toBeNull();
  });

  it("rejeita texto vazio ou sem categoria isolada", () => {
    expect(normalizarCategoria("")).toBeNull();
    expect(normalizarCategoria("A categoria é ACESSO")).toBeNull();
  });
});
