# 📄 DocMentorAI

**DocMentorAI** is a full-stack AI-powered web application that allows users to upload PDF documents and interact with them via chat. Using Retrieval-Augmented Generation (RAG), it processes the document, extracts key information, embeds it into a vector store, and enables natural language queries for intelligent Q&A over the document content.

---

## 🚀 Features

- 🧠 AI-powered chat over PDFs using Google Gemini
- 📄 Upload and process documents (PDF)
- 📌 Chunking and semantic embedding of document content
- 🔍 Fast retrieval with Qdrant vector store
- 🛠️ BullMQ-powered background job queue for processing
- 📊 Real-time progress updates during embedding
- 🔐 Clerk authentication (for user management)

---

## 🧱 Tech Stack

| Layer        | Technology                           |
|--------------|--------------------------------------|
| Frontend     | Next.js, Tailwind CSS                |
| Backend      | Node.js, Express.js                  |
| Auth         | Clerk                                |
| AI & LLM     | LangChain, Google Gemini / OpenAI    |
| Embeddings   | CustomNebius / OpenAI                |
| Vector DB    | Qdrant                               |
| Background   | BullMQ, Redis                        |
| File Uploads | Multer                               |

---

## 📁 Project Structure

```
DocMentorAI/
├── client/                        # Next.js frontend  
├── server/                        # Express backend  
│   ├── index.js                   # Main server file  
│   ├── worker.js                  # BullMQ job worker  
│   └── CustomNebiusEmbeddings.js  # Custom embedding handler  
├── docker-compose.yml             # Docker orchestration file  
├── .gitignore                     # Git ignored files config  
└── README.md                      # Project documentation
```


## 🧪 How It Works
- User uploads a PDF

- File is processed by a BullMQ background worker

- PDF is split into chunks and converted to vector embeddings

- Embeddings are stored in Qdrant vector DB

- User chats with the document — relevant chunks are retrieved and passed to LLM for response
