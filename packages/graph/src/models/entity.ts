export interface Entity {
  id: string;

  name: string;

  type: string;

  metadata?: Record<string, unknown>;
}
