import { EmbeddingModel, FlagEmbedding } from "fastembed";

export interface FastEmbedClientOptions {
    model?: EmbeddingModel;
}

export class FastEmbedClient {
    private model: FlagEmbedding | null = null;

    constructor(
        private readonly options: FastEmbedClientOptions = {},
    ) { }

    private async getModel(): Promise<FlagEmbedding> {
        if (!this.model) {
            this.model = await FlagEmbedding.init({
                model: EmbeddingModel.BGESmallENV15,
            });
        }

        return this.model;
    }

    async embed(text: string): Promise<number[]> {
        const embeddingModel = await this.getModel();

        for await (const batch of embeddingModel.embed([text])) {
            return batch[0]!;
        }

        throw new Error("Failed to generate embedding.");
    }

    async embedBatch(texts: string[]): Promise<number[][]> {
        const embeddingModel = await this.getModel();

        const vectors: number[][] = [];

        for await (const batch of embeddingModel.embed(texts)) {
            vectors.push(...batch);
        }

        return vectors;
    }
}