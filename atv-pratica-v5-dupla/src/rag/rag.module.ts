import { Module } from "@nestjs/common";
import { IngestaoService } from "./ingestao.service";
import { RagController } from "./rag.controller";

@Module({
  controllers: [RagController],
  providers: [IngestaoService],
})
export class RagModule {}
