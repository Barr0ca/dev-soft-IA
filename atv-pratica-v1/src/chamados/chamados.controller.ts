import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChamadosService } from './chamados.service';
import { ClassificarChamadoDto } from './dto/classificar-chamado.dto';

@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}

  @Post('classificar')
  @HttpCode(HttpStatus.OK)
  classificar(@Body() dto: ClassificarChamadoDto) {
    return this.chamadosService.classificar(dto.texto);
  }
}
