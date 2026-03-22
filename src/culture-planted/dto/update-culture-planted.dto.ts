import { PartialType } from '@nestjs/swagger';
import { CreateCulturePlantedDto } from './create-culture-planted.dto';

export class UpdateCulturePlantedDto extends PartialType(CreateCulturePlantedDto) {}
