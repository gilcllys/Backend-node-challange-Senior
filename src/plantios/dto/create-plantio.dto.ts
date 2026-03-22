import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePlantioDto {
  @ApiProperty({ description: 'ID da fazenda', example: 'uuid-here' })
  @IsNotEmpty()
  @IsUUID()
  farmId: string;

  @ApiProperty({ description: 'ID da safra', example: 'uuid-here' })
  @IsNotEmpty()
  @IsUUID()
  safraId: string;

  @ApiProperty({ description: 'ID da cultura plantada', example: 'uuid-here' })
  @IsNotEmpty()
  @IsUUID()
  culturePlantedId: string;
}
