import { Body, Controller, Post } from "@nestjs/common";
import { ClassificarChamadoDto } from "./dto/classificar-chamado.dto";
import { ChamadosService } from "./chamados.service";
import { ResumirChamadoDto } from "./dto/resumir-chamado.dto";

@Controller("chamados")
export class ChamadosController {
  constructor(private readonly chamados: ChamadosService) {}

  @Post("classificar")
  classificar(@Body() dto: ClassificarChamadoDto) {
    return this.chamados.classificar(dto.texto);
  }

  @Post("resumir")
  resumir(@Body() dto: ResumirChamadoDto) {
    return { texto: dto.texto };
  }
}
