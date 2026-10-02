import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResumirChamadoDto {
    @IsString()
    @MinLength(1)
    @MaxLength(2000)
    texto!: string;
}