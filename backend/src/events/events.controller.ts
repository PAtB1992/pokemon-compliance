import { Controller, Get } from '@nestjs/common';
import { InMemoryPublisherAdapter } from './in-memory-publisher.adapter';

@Controller('events')
export class EventsController {
  constructor(private readonly publisher: InMemoryPublisherAdapter) {}

  @Get('recent')
  recent() {
    return this.publisher.getRecent();
  }
}
