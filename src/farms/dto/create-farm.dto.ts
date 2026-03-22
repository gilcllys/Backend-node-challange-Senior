import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { IsValidArea } from '../../common/validators/area.validator';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Santa Maria',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Cidade', example: 'Ribeirão Preto' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado (UF)', example: 'SP' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: 'Área total em hectares', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @IsValidArea()
  totalArea: number;

  @ApiProperty({ description: 'Área agricultável em hectares', example: 600 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  arableArea: number;

  @ApiProperty({ description: 'Área de vegetação em hectares', example: 400 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  vegetationArea: number;

  @ApiProperty({ description: 'ID do produtor', example: 'uuid-here' })
  @IsNotEmpty()
  @IsUUID()
  producerId: string;
}
