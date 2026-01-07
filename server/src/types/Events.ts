export type EventType = 'page_view' | 'click';

export interface EventPayload {
  session_id: string;
  event_type: EventType;
  page_url: string;
  timestamp: number;
  x?: number;
  y?: number;
}
