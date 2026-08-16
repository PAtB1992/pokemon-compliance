import { Injectable, Logger } from '@nestjs/common';
import { PublisherPort } from './publisher.port';

export interface RecordedEvent {
  topic: string;
  payload: Record<string, unknown>;
  publishedAt: Date;
}

/**
 * Lokaler Ersatz fuer GCP Pub/Sub: "publiziert" nur in den Arbeitsspeicher, damit du
 * ueber GET /events/recent sehen kannst, was in der echten Plattform an ein Topic
 * gegangen waere. Vergleiche Kapitel "GCP Pub/Sub" im Interview-Guide.
 */
@Injectable()
export class InMemoryPublisherAdapter implements PublisherPort {
  private readonly logger = new Logger(InMemoryPublisherAdapter.name);
  private readonly recent: RecordedEvent[] = [];

  async publish(topic: string, payload: Record<string, unknown>): Promise<void> {
    this.logger.log(`Event publiziert auf "${topic}": ${JSON.stringify(payload)}`);
    this.recent.unshift({ topic, payload, publishedAt: new Date() });
    this.recent.length = Math.min(this.recent.length, 50);
  }

  getRecent(): RecordedEvent[] {
    return this.recent;
  }
}
