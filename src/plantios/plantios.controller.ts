import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreatePlantioDto } from './dto/create-plantio.dto';
import { PlantiosService } from './plantios.service';

@ApiTags('Plantios')
@Controller('plantios')
export class PlantiosController {
  constructor(private readonly plantiosService: PlantiosService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar novo plantio (fazenda + safra + cultura)',
  })
  @ApiResponse({ status: 201, description: 'Plantio registrado com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Fazenda, safra ou cultura não encontrada',
  })
  @ApiResponse({ status: 409, description: 'Combinação já registrada' })
  create(@Body() dto: CreatePlantioDto) {
    return this.plantiosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os plantios' })
  @ApiResponse({ status: 200, description: 'Lista de plantios com paginação' })
  findAll(@Query() pagination: PaginationDto) {
    return this.plantiosService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar plantio por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Plantio encontrado' })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantiosService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover plantio' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Plantio removido' })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantiosService.remove(id);
  }
}
