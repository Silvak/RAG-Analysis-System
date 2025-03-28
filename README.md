# RAG-Analysis-System

'''
rag-server/
├── src/
│ ├── index.js # Servidor Express principal
│ ├── routes/
│ │ └── upload.js # Ruta para cargar documentos
│ ├── services/
│ │ ├── extractText.js # Lógica para extraer texto
│ │ ├── embedding.js # Lógica para generar embeddings
│ │ └── chromaClient.js # Cliente de ChromaDB
├── uploads/ # Carpeta temporal para archivos subidos
├── Dockerfile
├── docker-compose.yml
├── .env
├── package.json
└── README.md
'''
