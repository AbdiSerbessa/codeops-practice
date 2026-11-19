import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Bearer token required (401)' })
@Controller('orders')
export class OrdersController {
  private readonly orders: Array<{ id: number; restaurant: string; area: string }> = [
    { id: 1, restaurant: 'Yod Abyssinia', area: 'bole' },
  ];

  @Get()
  @ApiOperation({ summary: 'List orders (requires Bearer token)' })
  @ApiOkResponse({ description: 'Orders list (200)' })
  findAll() {
    return this.orders;
  }

  @Post()
  @ApiOperation({ summary: 'Create order (requires Bearer token)' })
  @ApiCreatedResponse({ description: 'Order created (201)' })
  create(@Body() body: { restaurant: string; area: string }) {
    const created = {
      id: this.orders.length + 1,
      restaurant: body.restaurant,
      area: body.area,
    };
    this.orders.push(created);
    return created;
  }
}