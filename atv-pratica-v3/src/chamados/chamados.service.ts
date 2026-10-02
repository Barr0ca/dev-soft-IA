import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from '../ia/providers/modelo.provider';
import {
  CHAMADO_CATEGORIAS,
  normalizarCategoria,
  type ChamadoCategoria,
} from './chamado-categoria';

export interface ChamadoClassificado {
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

  async classificar(texto: string): Promise<ChamadoClassificado> {
    const textoNormalizado = texto.trim();
    const resultado = await this.modelo.gerar({
      mensagem: this.montarInstrucao(textoNormalizado),
    });
    const categoria = normalizarCategoria(resultado.resposta);

    if (!categoria) {
      throw new BadGatewayException(
        'O modelo retornou uma categoria inválida',
      );
    }

    return {
      texto: textoNormalizado,
      categoria,
      modelo: resultado.modelo,
    };
  }

  private montarInstrucao(texto: string): string {
    const categorias = CHAMADO_CATEGORIAS.join(', ');

    return [
      'Você classifica chamados de uma central de atendimento acadêmico.',
      `Escolha exatamente uma destas categorias: ${categorias}.`,
      'Significado de cada categoria:',
      '- ACESSO: senha, autenticação, bloqueio ou dificuldade para entrar no sistema.',
      '- FINANCEIRO: cobrança, pagamento, boleto, mensalidade ou reembolso.',
      '- MATRICULA: matrícula, cancelamento de disciplina, turma ou período letivo.',
      '- DOCUMENTOS: declaração, histórico, certificado ou comprovante.',
      '- OUTROS: chamados que não se encaixam nas categorias anteriores.',
      'Exemplos:',
      'Chamado: Minha senha foi bloqueada e não consigo entrar. Resposta: ACESSO',
      'Chamado: Preciso da segunda via do boleto da mensalidade. Resposta: FINANCEIRO',
      'Chamado: Quero cancelar a matrícula de uma disciplina. Resposta: MATRICULA',
      'Chamado: Preciso de uma declaração de vínculo. Resposta: DOCUMENTOS',
      'Chamado: O laboratório está sem luz. Resposta: OUTROS',
      'Responda com uma única palavra: a categoria, em maiúsculas, sem acento extra e sem explicação.',
      'Não escreva ACCESSO. A categoria de login e senha é ACESSO.',
      'Chamado:',
      texto,
    ].join('\n');
  }
}
