import { interpretarResumo } from './resumo.chamado';

const RESUMO =
  'O solicitante não consegue emitir a segunda via do boleto no portal do aluno.';

function resposta(parcial: Record<string, unknown> = {}): string {
  return JSON.stringify({
    titulo: 'Segunda via do boleto indisponível',
    resumo: RESUMO,
    pontosImportantes: ['Não consegue emitir a segunda via do boleto'],
    revisaoHumana: false,
    ...parcial,
  });
}

describe('interpretarResumo', () => {
  it('aceita o JSON do contrato', () => {
    expect(interpretarResumo(resposta())).toEqual({
      titulo: 'Segunda via do boleto indisponível',
      resumo: RESUMO,
      pontosImportantes: ['Não consegue emitir a segunda via do boleto'],
      revisaoHumana: false,
    });
  });

  it('rejeita título acima de 80 caracteres', () => {
    expect(interpretarResumo(resposta({ titulo: 'A'.repeat(81) }))).toBeNull();
  });

  it('rejeita resumo fora de 40 a 300 caracteres', () => {
    expect(interpretarResumo(resposta({ resumo: 'Curto demais.' }))).toBeNull();
    expect(interpretarResumo(resposta({ resumo: 'B'.repeat(301) }))).toBeNull();
  });

  it('rejeita mais de três pontos', () => {
    expect(
      interpretarResumo(
        resposta({ pontosImportantes: ['um', 'dois', 'três', 'quatro'] }),
      ),
    ).toBeNull();
  });

  it('aceita lista vazia de pontos', () => {
    expect(
      interpretarResumo(resposta({ pontosImportantes: [] }))?.pontosImportantes,
    ).toEqual([]);
  });

  it('rejeita revisaoHumana que não seja booleano', () => {
    expect(interpretarResumo(resposta({ revisaoHumana: 'true' }))).toBeNull();
  });

  it('rejeita texto que não é JSON', () => {
    expect(interpretarResumo('ACESSO')).toBeNull();
  });
});