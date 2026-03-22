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
import { CulturePlantedService } from './culture-planted.service';
import { CreateCulturePlantedDto } from './dto/create-culture-planted.dto';
import { UpdateCulturePlantedDto } from './dto/update-culture-planted.dto';

@ApiTags('Culturas Plantadas')
@Controller('culture-planted')
export class CulturePlantedController {
  constructor(private readonly cultureService: CulturePlantedService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova cultura plantada' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Cultura já existe' })
  create(@Body() dto: CreateCulturePlantedDto) {
    return this.cultureService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as culturas plantadas' })
  @ApiResponse({ status: 200, description: 'Lista de culturas com paginação' })
  findAll(@Query() pagination: PaginationDto) {
    return this.cultureService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultureService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cultura plantada' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCulturePlantedDto,
  ) {
    return this.cultureService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover cultura plantada' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Cultura removida' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultureService.remove(id);
  }
}
