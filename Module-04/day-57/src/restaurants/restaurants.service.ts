import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Page } from '../common/page.js';
import { parseCsv, selectFields, sortByField } from '../common/query.utils.js';
import type { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import type { FindRestaurantsQueryDto } from './dto/find-restaurants-query.dto.js';
import type { Restaurant } from './restaurant.types.js';

export const RESTAURANT_REPOSITORY = 'RESTAURANT_REPOSITORY';

export interface RestaurantRepository {
  all(): Restaurant[];
  byId(id: number): Restaurant | undefined;
  create(input: Omit<Restaurant, 'id'>): Restaurant;
  deleteById(id: number): boolean;
}

export class InMemoryRestaurantRepository implements RestaurantRepository {
  private readonly store = new Map<number, Restaurant>();
  private nextId = 1;

  constructor(initial: Restaurant[] = []) {
    for (const item of initial) {
      this.store.set(item.id, { ...item });
      if (item.id >= this.nextId) this.nextId = item.id + 1;
    }
  }

  all(): Restaurant[] {
    return Array.from(this.store.values());
  }

  byId(id: number): Restaurant | undefined {
    const found = this.store.get(id);
    return found ? { ...found } : undefined;
  }

  create(input: Omit<Restaurant, 'id'>): Restaurant {
    const created: Restaurant = { id: this.nextId++, ...input };
    this.store.set(created.id, created);
    return { ...created };
  }

  deleteById(id: number): boolean {
    return this.store.delete(id);
  }
}

@Injectable()
export class RestaurantsService {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly repo: RestaurantRepository,
  ) {}

  findAll(query: FindRestaurantsQueryDto): Page<Partial<Restaurant>> {
    let list = this.repo.all();

    const areas = parseCsv(query.area)?.map((a) => a.toLowerCase());
    if (areas) {
      list = list.filter((r) => areas.includes(r.area.toLowerCase()));
    }

    const cuisines = parseCsv(query.cuisine)?.map((c) => c.toLowerCase());
    if (cuisines) {
      list = list.filter((r) => cuisines.includes(r.cuisine.toLowerCase()));
    }

    const sorted = sortByField(list, query.sort, ['id', 'name', 'area']);
    const sliced = sorted.slice(query.offset, query.offset + query.limit);
    const shaped = selectFields(sliced, query.fields, [
      'id',
      'name',
      'area',
      'cuisine',
    ]);

    return {
      items: shaped,
      total: sorted.length,
      limit: query.limit,
      offset: query.offset,
    };
  }

  findOne(id: number): Restaurant {
    const found = this.repo.byId(id);
    if (!found) {
      throw new NotFoundException(`Restaurant ${id} not found`);
    }
    return found;
  }

  create(dto: CreateRestaurantDto): Restaurant {
    return this.repo.create(dto);
  }

  // Idempotent DELETE: returns void whether it existed or was already deleted
  delete(id: number): void {
    this.repo.deleteById(id);
  }
}