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
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { SafrasService } from './safras.service';

@ApiTags('Safras')
@Controller('safras')
export class SafrasController {
  constructor(private readonly safrasService: SafrasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Safra já existe' })
  create(@Body() dto: CreateSafraDto) {
    return this.safrasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as safras' })
  @ApiResponse({ status: 200, description: 'Lista de safras com paginação' })
  findAll(@Query() pagination: PaginationDto) {
    return this.safrasService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Safra encontrada' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.safrasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar safra' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSafraDto) {
    return this.safrasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover safra' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Safra removida' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.safrasService.remove(id);
  }
}
