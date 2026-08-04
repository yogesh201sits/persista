export interface GraphStore {
  connect(sourceId: string, targetId: string, relation: string): Promise<void>;
}
