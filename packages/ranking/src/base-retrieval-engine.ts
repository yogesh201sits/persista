export interface BaseRetrievalEngine<
  TOptions,
  TResult,
> {
  search(
    query: string,
    options?: TOptions,
  ): Promise<TResult>;
}