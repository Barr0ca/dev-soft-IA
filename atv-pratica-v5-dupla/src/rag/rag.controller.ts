import { Controller, Get, Post } from "@nestjs/common";
import { IngestaoService } from "./ingestao.service";

@Controller("rag/ingestao")
export class RagController {
  constructor(private readonly ingestao: IngestaoService) {}

  @Post()
  executar() {
    return this.ingestao.executar();
  }

  @Get("status")
  status() {
    return this.ingestao.status();
  }
}
