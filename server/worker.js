import {Worker} from 'bullmq'
import {QdrantVectorStore} from '@langchain/qdrant'
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from '@langchain/ollama'
import { QdrantClient } from '@qdrant/js-client-rest';
import { CustomNebiusEmbeddings } from './CustomNebiusEmbeddings.js';
import dotenv from 'dotenv';
dotenv.config();

const worker = new Worker(
    'file-upload-queue',
    async (job)=>{
        console.log(`Job:`, job.data)
        const data = JSON.parse(job.data)

        //Load the pdf
        const filename = job.data.filename
        const loader = new PDFLoader(data.path)
        const docs = await loader.load()
        const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
        });
        const texts = await textSplitter.splitDocuments(docs);
        console.log(`🧩 Total chunks: ${texts.length}`)

        // console.log("Splits",texts)

        // OPENAI Embeddings
        // const embeddings = new OpenAIEmbeddings({
        //     model: 'text-embedding-3-small',
        //     apiKey: process.env.OPENAI_SECRET_KEY
        // })
        
        // Ollama embeddings
        // const embeddings = new OllamaEmbeddings({
        //     model: 'nomic-embed-text',
        // })
        console.log("🔑 Nebius key:", process.env.NEBIUS_SECRET_KEY)

        const embeddings = new CustomNebiusEmbeddings({
            model: 'intfloat/e5-mistral-7b-instruct',
        })
        console.log("first")
        const client = new QdrantClient({ url: process.env.QDRANT_URL });
        console.log("second")

        try {
        await client.deleteCollection('langchainjs-testing');
        console.log('🧹 Old collection deleted');
        } catch (err) {
        console.error('⚠️ Failed to delete collection:', err.message);
        }
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: QDRANT_URL,
                collectionName: 'langchainjs-testing'
            }
        )
        console.log("testing2",)
        const waitWithTimeout = (promise, ms) => {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('⏱ Timeout')), ms)),
        ])
        }
        const batchSize = 10
        for (let i = 0; i < texts.length; i += batchSize) {
        const batchNum = Math.floor(i / batchSize) + 1
        const batch = texts.slice(i, i + batchSize)

        console.log(`⏳ Starting batch ${batchNum} of ${Math.ceil(texts.length / batchSize)}`)

        try {
            await waitWithTimeout(vectorStore.addDocuments(batch), 30000) 
            const progressPercent = Math.min(100,Math.floor(((i + batch.length) / texts.length) * 100))
            await job.updateProgress(progressPercent)
            console.log(` Added batch ${batchNum}, progress: ${progressPercent}%`)
            console.log(` Added batch ${batchNum}`)
        } catch (err) {
            console.error(` Failed batch ${batchNum}: ${err.message}`)
        }
        }
        console.log("all docs are added to vector store") 
        return {message: "Successfully processed PDF",filename}
    },  
    {   concurrency: 100,
        connection:{
        host: 'localhost',
        port: '6379'
    }}
)
