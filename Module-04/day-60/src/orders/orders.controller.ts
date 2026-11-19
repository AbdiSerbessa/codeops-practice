import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiRequestTimeoutResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService, type OrderRecord } from './orders.service.js';

@ApiTags('Orders')
@ApiSecurity('api-key')
@ApiUnauthorizedResponse({ description: 'Missing API key (401)' })
@ApiForbiddenResponse({ description: 'Invalid API key (403)' })
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List orders optionally filtered by area' })
  @ApiQuery({ name: 'area', required: false, example: 'bole' })
  @ApiOkResponse({ description: 'Orders returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters (400)' })
  findAll(@Query('area') area?: string): OrderRecord[] {
    return this.ordersService.findAll(area);
  }

  @Get('slow')
  @ApiOperation({ summary: 'Run delayed report endpoint to test 408 timeout' })
  @ApiOkResponse({ description: 'Report completed' })
  @ApiRequestTimeoutResponse({ description: 'Request timed out (408)' })
  getSlowReport(): Promise<{ status: string; delayMs: number }> {
    return this.ordersService.slowReport();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by numeric ID' })
  @ApiOkResponse({ description: 'Order found' })
  @ApiBadRequestResponse({ description: 'Invalid order ID (400)' })
  @ApiNotFoundResponse({ description: 'Order not found (404)' })
  findOne(@Param('id', ParseIntPipe) id: number): OrderRecord {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Place a new food order' })
  @ApiCreatedResponse({ description: 'Order created (201)' })
  @ApiBadRequestResponse({ description: 'Validation failed (400)' })
  create(@Body() body: CreateOrderDto): OrderRecord {
    return this.ordersService.create(body);
  }
}