import { BadGatewayException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { type Mocked } from 'vitest';
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from '../ia/providers/modelo.provider';
import { ChamadosService } from './chamados.service';

describe('ChamadosService', () => {
  let service: ChamadosService;
  let provider: Mocked<ModeloProvider>;

  beforeEach(async () => {
    provider = {
      gerar: vi.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChamadosService,
        {
          provide: MODELO_PROVIDER,
          useValue: provider,
        },
      ],
    }).compile();

    service = moduleRef.get(ChamadosService);
  });

  it('classifica o chamado e devolve o JSON montado no backend', async () => {
    provider.gerar.mockResolvedValue({
      resposta: 'ACESSO',
      modelo: 'llama3.2:latest',
    });

    const texto =
      'Não consigo acessar o portal porque minha senha foi bloqueada.';

    await expect(service.classificar(`  ${texto}  `)).resolves.toEqual({
      texto,
      categoria: 'ACESSO',
      modelo: 'llama3.2:latest',
    });

    expect(provider.gerar).toHaveBeenCalledTimes(1);
    const instrucao = provider.gerar.mock.calls[0]?.[0].mensagem ?? '';
    expect(instrucao).toContain('ACESSO');
    expect(instrucao).toContain('FINANCEIRO');
    expect(instrucao).toContain('MATRICULA');
    expect(instrucao).toContain('DOCUMENTOS');
    expect(instrucao).toContain('OUTROS');
    expect(instrucao).toContain(texto);
  });

  it('falha de forma controlada quando a categoria não é permitida', async () => {
    provider.gerar.mockResolvedValue({
      resposta: 'SUPORTE',
      modelo: 'llama3.2:latest',
    });

    await expect(
      service.classificar('Preciso de ajuda com o portal de aluno.'),
    ).rejects.toBeInstanceOf(BadGatewayException);

    await expect(
      service.classificar('Preciso de ajuda com o portal de aluno.'),
    ).rejects.toThrow('O modelo retornou uma categoria inválida');
  });
});
