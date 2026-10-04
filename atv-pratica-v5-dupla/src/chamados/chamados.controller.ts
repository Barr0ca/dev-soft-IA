import { Body, Controller, Post } from "@nestjs/common";
import { ClassificarChamadoDto } from "./dto/classificar-chamado.dto";
import { ChamadosService } from "./chamados.service";
import { ResumirChamadoDto } from "./dto/resumir-chamado.dto";
import { SugerirRespostaDto } from "./dto/sugerir-resposta.dto";

@Controller("chamados")
export class ChamadosController {
  constructor(private readonly chamados: ChamadosService) {}

  @Post("classificar")
  classificar(@Body() dto: ClassificarChamadoDto) {
    return this.chamados.classificar(dto.texto);
  }

  @Post("resumir")
  resumir(@Body() dto: ResumirChamadoDto) {
    return this.chamados.resumir(dto.texto);
  }

  @Post("sugerir")
  sugerir(@Body() dto: SugerirRespostaDto) {
    return this.chamados.sugerir(dto.texto);
  }
}
