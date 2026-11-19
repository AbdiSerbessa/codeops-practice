import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Page } from '../common/page.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { FindRestaurantsQueryDto } from './dto/find-restaurants-query.dto.js';
import type { Restaurant } from './restaurant.types.js';
import { RestaurantsService } from './restaurants.service.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query() query: FindRestaurantsQueryDto): Page<Partial<Restaurant>> {
    return this.restaurantsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Restaurant {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateRestaurantDto,
    @Res({ passthrough: true }) res: Response,
  ): Restaurant {
    const created = this.restaurantsService.create(dto);
    res.setHeader('Location', `/api/v1/restaurants/${created.id}`);
    return created;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.restaurantsService.delete(id);
  }
}