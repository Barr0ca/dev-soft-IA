import { Module } from '@nestjs/common';
import { IaModule } from '../ia/ia.module';
import { AvaliadorClassificacaoService } from './avaliacao/avaliador-classificacao.service';
import { ChamadosController } from './chamados.controller';
import { ChamadosService } from './chamados.service';
import { AvaliadorSugestaoService } from './avaliacao/avaliador-sugestao.service';

@Module({
  imports: [IaModule],
  controllers: [ChamadosController],
  providers: [ChamadosService, AvaliadorClassificacaoService, AvaliadorSugestaoService],
  exports: [AvaliadorClassificacaoService, AvaliadorSugestaoService],
})
export class ChamadosModule { }