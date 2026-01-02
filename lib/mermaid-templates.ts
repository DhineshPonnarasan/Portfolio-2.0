/**
 * Optimized Mermaid diagram templates
 * Clean, simple flowcharts without subgraphs for better rendering
 */

export const MERMAID_DIAGRAMS: Record<string, { architecture: string; workflow: string }> = {
  'social-media-sentiment': {
    architecture: `graph LR
      A[📱 Social Apps] -->|Stream| B[📨 Kafka]
      B -->|Ingest| C[⚡ Spark]
      C -->|Process| D[🧠 BERT]
      D -->|Store| E[💾 Features]
      D -->|Alert| F[🔔 Alerts]
      F -->|Send| G[📊 Dashboard]
      E -->|Feedback| C`,
    workflow: `graph TD
      A[📥 Raw Stream] --> B[🌐 Lang Detect]
      B --> C[📝 Tokenize]
      C --> D[🧠 BERT]
      D --> E[📊 Aggregate]
      E --> F[🚨 Alerts]
      F --> G[📈 Dashboard]`
  },
  
  'customer-churn-intelligence': {
    architecture: `graph LR
      A[🗄️ Data Lake] --> B[🔄 Airflow]
      B --> C[📦 Features]
      C --> D[🧪 MLflow]
      D --> E[🤖 Ensemble]
      E --> F[⚙️ FastAPI]
      F --> G[📊 Dashboard]
      G -->|Feedback| B`,
    workflow: `graph TD
      A[📥 Ingest] --> B[🧹 Clean]
      B --> C[📚 Train]
      C --> D[✅ Register]
      D --> E[🚀 Deploy]
      E --> F[📡 Monitor]
      F -->|Retrain| A`
  },
  
  'brain-tumor-classification': {
    architecture: `graph LR
      A[🏥 PACS] --> B[🖼️ Preprocess]
      B --> C[🧠 CNN]
      C --> D[🔍 Grad-CAM]
      D --> E[📋 Report]
      E --> F[👨‍⚕️ Portal]`,
    workflow: `graph TD
      A[📤 MRI Input] --> B[⚙️ Normalize]
      B --> C[🧠 CNN]
      C --> D[🔥 Heatmap]
      D --> E[✔️ QA Review]
      E --> F[📄 Export]`
  },
  
  'financial-fraud-detection': {
    architecture: `graph LR
      A[💳 Payments] --> B[📨 Kafka]
      B --> C[🔢 Features]
      C --> D[🤖 Autoencoder]
      C --> E[🌳 IsoForest]
      D --> F[⚡ Scorer]
      E --> F
      F --> G[🚨 SOC]`,
    workflow: `graph TD
      A[💸 Transaction] --> B[⚙️ Normalize]
      B --> C[📊 Encode]
      C --> D[🎯 Threshold]
      D --> E[📋 Case]
      E --> F[👁️ Review]`
  },
  
  'yolov8-inference-engine': {
    architecture: `graph LR
      A[📹 Cameras] --> B[🔄 Preprocess]
      B --> C[🎯 YOLOv8]
      C --> D[⚡ TensorRT]
      D --> E[🌐 Gateway]
      E --> F[📊 Monitor]`,
    workflow: `graph TD
      A[📹 Frame] --> B[🔀 Decode]
      B --> C[🖼️ Resize]
      C --> D[🎯 Detect]
      D --> E[🧹 NMS]
      E --> F[✏️ Annotate]
      F --> G[📤 Stream]`
  },
  
  'hybrid-recommendation-engine': {
    architecture: `graph LR
      A[👤 Events] --> B[💾 Features]
      B --> C[🧠 Embeddings]
      C --> D[⚡ FAISS]
      D --> E[🎯 Candidates]
      E --> F[📊 Ranker]
      F --> G[🎁 Diversify]
      G --> H[🚀 API]`,
    workflow: `graph TD
      A[👤 Signals] --> B[📦 Embed]
      B --> C[🔍 Search]
      C --> D[🔄 Rerank]
      D --> E[🎯 Diversify]
      E --> F[📤 Serve]
      F -->|Feedback| A`
  },
  
  'demand-forecasting-pipeline': {
    architecture: `graph LR
      A[🏪 Retail Data] --> B[⚡ PySpark]
      B --> C[📦 Features]
      C --> D[📈 Prophet]
      C --> E[🌳 XGBoost]
      D --> F[🎯 Ensemble]
      E --> F
      F --> G[📊 Dashboard]`,
    workflow: `graph TD
      A[📥 Sales] --> B[🧹 Clean]
      B --> C[⚙️ Features]
      C --> D[📚 Prophet]
      C --> E[📚 XGBoost]
      D --> F[📊 Ensemble]
      E --> F
      F --> G[✔️ Validate]
      G --> H[📈 Publish]`
  },
  
  'resume-parser': {
    architecture: `graph LR
      A[📄 Upload] --> B[🧹 OCR]
      B --> C[🏷️ NER]
      C --> D[💼 Skills]
      D --> E[🔍 Match]
      E --> F[👥 Dashboard]`,
    workflow: `graph TD
      A[📥 Resume] --> B[📤 OCR]
      B --> C[🧹 Clean]
      C --> D[🏷️ Extract]
      D --> E[🎯 Normalize]
      E --> F[🔗 Match]
      F --> G[📊 Score]`
  },
  
  'cloud-data-warehouse': {
    architecture: `graph LR
      A[📊 Sources] --> B[🌊 Lake]
      B --> C[⚙️ dbt]
      C --> D[🏢 DW]
      D --> E[📈 BI]
      E --> F[👥 Users]`,
    workflow: `graph TD
      A[🔌 Connect] --> B[📥 Extract]
      B --> C[🌊 Stage]
      C --> D[⚙️ Transform]
      D --> E[🗄️ Load]
      E --> F[🔍 Quality]
      F --> G[📊 Serve]`
  },
  
  'quantum-blood-group': {
    architecture: `graph LR
      A[🩸 Sample] --> B[🔄 Preprocess]
      B --> C[🧠 CNN]
      C --> D[⚛️ VQC]
      D --> E[🎯 Classify]
      E --> F[📊 Results]`,
    workflow: `graph TD
      A[📸 Image] --> B[⚙️ Normalize]
      B --> C[🧠 Features]
      C --> D[⚛️ Quantum]
      D --> E[📊 Output]
      E --> F[✔️ Classify]`
  }
};
