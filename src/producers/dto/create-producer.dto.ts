import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidCpfCnpj } from '../../common/validators/cpf-cnpj.validator';

export class CreateProducerDto {
  @ApiProperty({ description: 'CPF ou CNPJ do produtor', example: '368.366.557-24' })
  @IsNotEmpty()
  @IsString()
  @IsValidCpfCnpj()
  cpfCnpj: string;

  @ApiProperty({ description: 'Nome do produtor', example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
