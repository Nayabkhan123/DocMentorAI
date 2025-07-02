import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Queue, QueueEvents, Job } from 'bullmq'
import { fileURLToPath } from 'url';
// import { OllamaEmbeddings} from '@langchain/ollama'
// import { ChatOllama } from 'langchain/chat_models/ollama';
import { QdrantVectorStore } from '@langchain/qdrant';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CustomNebiusEmbeddings } from './CustomNebiusEmbeddings.js';
import dotenv from 'dotenv';
dotenv.config();
// import OpenAI from 'openai';
// const client = new OpenAI({
//   apiKey: 
//   process.env.OPENAI_SECRET_KEY
// })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const queue = new Queue('file-upload-queue', {
  connection:{
        host: 'localhost',
        port: '6379'
  },
})
const queueEvents = new QueueEvents('file-upload-queue', {
  connection:{
        host: 'localhost',
        port: '6379'
  },
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'upload');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  return res.json({ status: "all good" });
});

app.get('/status/:jobId',async(req,res)=>{
  const jobId = req.params.jobId
  const job = await Job.fromId(queue,jobId)
  if(!job) return res.status(404).json({status:'not_found'})
  const state = await job.getState();
  const progress = job.progress
  res.json({
    status: state,
    progress,
    returnValue: job.returnvalue || null
  })
})

app.post('/upload/pdf', upload.single('pdf'), async(req, res) => {
  const job = await queue.add('file-ready', JSON.stringify({
    filename: req.file.originalname,
    source: req.file.destination,
    path: req.file.path
  }))
  return res.json({ status: "uploaded", file: req.file, jobId: job.id });
});

app.get('/chat',async(req,res)=>{
  const userQuery = req.query.message || "hello"
  // const embeddings = new OllamaEmbeddings({
  //     model: 'nomic-embed-text',
  // })
  const embeddings = new CustomNebiusEmbeddings({
      model: 'intfloat/e5-mistral-7b-instruct',
  })
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
        url: 'http://localhost:6333',
        collectionName: 'langchainjs-testing'
    }
  )
  const retriever = vectorStore.asRetriever({
    k:5,
  })
  const docs = await retriever.invoke(userQuery)
  const context = docs.map(d=>d.pageContent).join('\n---\n')
  const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_SECRET_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  const SYSTEM_PROMPT = `
  "Answer the question thoroughly using the full context. Include important details, and explain clearly in multiple sentences if needed."

  Context:
  ${JSON.stringify(context)}
  ---
  Question: ${userQuery}
  
  `
  const result = await model.generateContent(SYSTEM_PROMPT);
  const response = result.response;
  const answer = response.text();

  
  return res.json({
    message: answer,
    docs:docs
  })
})

app.listen(8000, async() => {
  console.log("server started on http://localhost:8000");
});
