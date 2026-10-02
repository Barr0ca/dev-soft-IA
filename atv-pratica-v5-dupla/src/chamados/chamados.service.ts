import {
  BadGatewayException,
  Inject,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from "../ia/providers/modelo.provider";
import { isChamadoCategoria, type ChamadoCategoria } from "./chamado.categoria";
import { buildClassificacaoPrompt } from "./classificacao.prompt";
import { buildResumoPrompt } from "./resumo.prompt";
import { interpretarResumo } from "./resumo.chamado";

export interface ClassificacaoResultado {
  texto: string;
  categoria: ChamadoCategoria;
  modelo: string;
}

@Injectable()
export class ChamadosService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modelo: ModeloProvider,
  ) {}

  async classificar(textoOriginal: string): Promise<ClassificacaoResultado> {
    const texto = textoOriginal.trim();
    const prompt = buildClassificacaoPrompt(texto);
    const resultado = await this.modelo.gerar({ mensagem: prompt });
    const categoria = resultado.resposta.trim().toUpperCase();

    if (!isChamadoCategoria(categoria)) {
      throw new BadGatewayException("O modelo retornou uma categoria inválida");
    }

    return {
      texto,
      categoria,
      modelo: resultado.modelo,
    };
  }

  async resumir(textoOriginal: string) {
    const texto = textoOriginal.trim();

    if (!texto) {
      throw new BadRequestException("O texto do chamado é obrigatório");
    }

    const prompt = buildResumoPrompt(texto);
    const resultado = await this.modelo.gerar({ mensagem: prompt });
    const interpretado = interpretarResumo(resultado.resposta);

    if (!interpretado) {
      throw new BadGatewayException(
        "O modelo retornou um resumo fora do contrato",
      );
    }

    return {
      ...interpretado,
      revisaoHumana: texto.length < 40 ? true : interpretado.revisaoHumana,
      modelo: resultado.modelo,
    };
  }
}
