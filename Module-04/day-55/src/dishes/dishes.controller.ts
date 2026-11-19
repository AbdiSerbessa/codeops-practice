import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DishesService } from './dishes.service.js';
import { CreateDishDto } from './dto/create-dish.dto.js';
import { DishNotFoundError, RestaurantNotFoundError } from './dish.errors.js';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    if (restaurantId !== undefined) {
      const parsedId = Number(restaurantId);
      return this.dishesService.findAll(
        Number.isNaN(parsedId) ? -1 : parsedId,
      );
    }
    return this.dishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.dishesService.findById(id);
    } catch (error) {
      if (error instanceof DishNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  create(@Body() dto: CreateDishDto) {
    try {
      return this.dishesService.create(dto);
    } catch (error) {
      if (error instanceof RestaurantNotFoundError) {
        throw new UnprocessableEntityException(error.message);
      }
      throw error;
    }
  }
}