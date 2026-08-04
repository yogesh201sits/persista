import type { Memory } from "../types";

export interface MemoryStore {
  create(memory: Memory): Promise<Memory>;

  update(memory: Memory): Promise<Memory>;

  delete(id: string): Promise<void>;

  getById(id: string): Promise<Memory | null>;
}
