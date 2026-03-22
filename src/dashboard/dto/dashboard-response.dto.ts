import { ApiProperty } from '@nestjs/swagger';

export class StateCount {
  @ApiProperty({ example: 'SP' })
  state: string;

  @ApiProperty({ example: 5 })
  count: number;
}

export class CultureCount {
  @ApiProperty({ example: 'Soja' })
  culture: string;

  @ApiProperty({ example: 10 })
  count: number;
}

export class LandUse {
  @ApiProperty({ example: 5000 })
  arableArea: number;

  @ApiProperty({ example: 3000 })
  vegetationArea: number;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 15 })
  totalFarms: number;

  @ApiProperty({ example: 25000 })
  totalHectares: number;

  @ApiProperty({ type: [StateCount] })
  byState: StateCount[];

  @ApiProperty({ type: [CultureCount] })
  byCulture: CultureCount[];

  @ApiProperty({ type: LandUse })
  byLandUse: LandUse;
}
