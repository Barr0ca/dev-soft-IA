import { Test } from "@nestjs/testing";
import { MODELO_PROVIDER } from "../ia/providers/modelo.provider";
import { ChamadosService } from "./chamados.service";

describe("ChamadosService", () => {
  const gerar = vi.fn();
  let service: ChamadosService;

  beforeEach(async () => {
    gerar.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChamadosService,
        {
          provide: MODELO_PROVIDER,
          useValue: { gerar },
        },
      ],
    }).compile();

    service = moduleRef.get(ChamadosService);
  });

  it("aceita uma categoria permitida", async () => {
    gerar.mockResolvedValue({
      resposta: " acesso ",
      modelo: "modelo-controlado",
    });

    await expect(
      service.classificar("Minha senha foi bloqueada."),
    ).resolves.toMatchObject({ categoria: "ACESSO" });
  });

  it("rejeita categoria inventada", async () => {
    gerar.mockResolvedValue({
      resposta: "SUPORTE_TECNICO",
      modelo: "modelo-controlado",
    });

    await expect(
      service.classificar("O computador está lento."),
    ).rejects.toThrow("categoria inválida");
  });

  it("rejeita explicação junto da categoria", async () => {
    gerar.mockResolvedValue({
      resposta: "ACESSO porque a senha expirou",
      modelo: "modelo-controlado",
    });

    await expect(service.classificar("Minha senha expirou.")).rejects.toThrow(
      "categoria inválida",
    );
  });
  it("devolve o resumo quando o modelo cumpre o contrato", async () => {
    gerar.mockResolvedValue({
      resposta: JSON.stringify({
        titulo: "Segunda via do boleto indisponível",
        resumo:
          "O solicitante não consegue emitir a segunda via do boleto no portal do aluno.",
        pontosImportantes: ["Não consegue emitir a segunda via do boleto"],
        revisaoHumana: false,
      }),
      modelo: "modelo-controlado",
    });

    await expect(
      service.resumir(
        "Não consigo emitir a segunda via do boleto no portal do aluno.",
      ),
    ).resolves.toMatchObject({
      titulo: "Segunda via do boleto indisponível",
      revisaoHumana: false,
      modelo: "modelo-controlado",
    });
  });

  it("rejeita resposta fora do contrato", async () => {
    gerar.mockResolvedValue({
      resposta: "Título: boleto. Resumo livre sem JSON.",
      modelo: "modelo-controlado",
    });

    await expect(
      service.resumir(
        "Não consigo emitir a segunda via do boleto no portal do aluno.",
      ),
    ).rejects.toThrow("resumo fora do contrato");
  });

  it("exige revisão humana em texto curto mesmo se o modelo dispensar", async () => {
    gerar.mockResolvedValue({
      resposta: JSON.stringify({
        titulo: "Pedido de ajuda sem detalhe",
        resumo:
          "O chamado pede ajuda, mas não descreve qual é o problema relatado.",
        pontosImportantes: [],
        revisaoHumana: false,
      }),
      modelo: "modelo-controlado",
    });

    await expect(service.resumir("Preciso de ajuda.")).resolves.toMatchObject({
      revisaoHumana: true,
    });
  });

  it("não consulta o modelo quando o texto fica vazio", async () => {
    await expect(service.resumir("   ")).rejects.toThrow("obrigatório");
    expect(gerar).not.toHaveBeenCalled();
  });
});
