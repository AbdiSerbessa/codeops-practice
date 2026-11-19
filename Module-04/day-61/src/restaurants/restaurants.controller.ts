import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator.js';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  private readonly restaurants = [
    { id: 1, name: 'Yod Abyssinia', area: 'bole' },
    { id: 2, name: 'Kategna Restaurant', area: 'kazanchis' },
    { id: 3, name: 'Totot Traditional', area: 'piassa' },
  ];

  @Public()
  @Get()
  @ApiOperation({ summary: 'List public restaurants (no token required)' })
  @ApiOkResponse({ description: 'Public restaurants list (200)' })
  findAll() {
    return this.restaurants;
  }
}