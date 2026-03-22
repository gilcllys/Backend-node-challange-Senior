import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmsService } from './farms.service';

@ApiTags('Fazendas')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou área excedida' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  create(@Body() dto: CreateFarmDto) {
    return this.farmsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas com paginação' })
  findAll(@Query() pagination: PaginationDto) {
    return this.farmsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFarmDto) {
    return this.farmsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover fazenda (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Fazenda removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.remove(id);
  }
}
