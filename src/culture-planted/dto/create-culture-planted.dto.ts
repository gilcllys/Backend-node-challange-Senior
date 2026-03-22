import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCulturePlantedDto {
  @ApiProperty({ description: 'Nome da cultura plantada', example: 'Soja' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
