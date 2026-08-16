import { Module } from '@nestjs/common';
import { InMemoryPublisherAdapter } from './in-memory-publisher.adapter';
import { PUBLISHER_PORT } from './publisher.port';
import { EventsController } from './events.controller';

@Module({
  controllers: [EventsController],
  providers: [InMemoryPublisherAdapter, { provide: PUBLISHER_PORT, useExisting: InMemoryPublisherAdapter }],
  exports: [PUBLISHER_PORT],
})
export class EventsModule {}
