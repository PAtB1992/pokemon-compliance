/**
 * Abstraktion ueber den konkreten Event-Transport (Ports-and-Adapters-Pattern,
 * siehe Kapitel "Architektur & Vorgehen" im Interview-Guide). Lokal implementiert
 * die InMemoryPublisherAdapter dieses Interface; in der echten Plattform waere es
 * eine GcpPubSubPublisherAdapter-Klasse, die den @google-cloud/pubsub-Client nutzt -
 * der Rest der Anwendung (ComplianceService) muesste dafuer NICHT angepasst werden.
 */
export interface PublisherPort {
  publish(topic: string, payload: Record<string, unknown>): Promise<void>;
}

export const PUBLISHER_PORT = Symbol('PUBLISHER_PORT');
