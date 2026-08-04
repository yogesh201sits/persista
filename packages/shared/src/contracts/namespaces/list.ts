export interface NamespaceSummary {
  id: string;
  name: string;
  createdAt: string;
}

export interface ListNamespacesResponse {
  namespaces: NamespaceSummary[];
}