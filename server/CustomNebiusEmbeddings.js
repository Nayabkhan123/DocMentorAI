import { Embeddings } from '@langchain/core/embeddings';
import OpenAI from 'openai';

export class CustomNebiusEmbeddings extends Embeddings {
    constructor(fields) {
        super();
        this.model = (fields && fields.model) || 'intfloat/e5-mistral-7b-instruct';
        this.client = new OpenAI({
            baseURL: 'https://api.studio.nebius.com/v1/',
            apiKey: process.env.NEBIUS_SECRET_KEY,
        });
    }

    async embedDocuments(documents) {
        const embeddings = [];

        for (const input of documents) {
            const res = await this.client.embeddings.create({
                model: this.model,
                input: input,
            });
            embeddings.push(res.data[0].embedding);
        }

        return embeddings;
    }

    async embedQuery(document) {
        const res = await this.client.embeddings.create({
            model: this.model,
            input: document,
        });

        return res.data[0].embedding;
    }
}

