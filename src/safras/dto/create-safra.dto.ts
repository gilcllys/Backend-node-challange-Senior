import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSafraDto {
  @ApiProperty({ description: 'Nome da safra', example: 'Safra 2024' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
