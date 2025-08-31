export interface AppendEventData {
  namespace: string;
  actorId: string;
  verb: string;
  targetType: string;
  targetId: string;
  payload: unknown;
  clientToken?: string;
}

export interface EventResult {
  id: string;
  ts: string;
  hash: string;
}

export interface EventRecord {
  id: string;
  ts: string;
  verb: string;
  namespace: string;
  targetType: string;
  targetId: string;
  payload: unknown;
}

export interface EventStorePort {
  append(event: AppendEventData): Promise<EventResult>;
  getLatestEvent(): Promise<{ hash: string } | null>;
}
