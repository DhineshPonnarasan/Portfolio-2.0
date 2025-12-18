/**
 * Mermaid diagram templates for all projects
 * Architecture & Workflow diagrams in Mermaid syntax
 */

export const MERMAID_DIAGRAMS = {
  'social-media-sentiment': {
    architecture: `graph LR
      A["📱 Social Apps<br/>Twitter, TikTok, etc"] -->|Stream| B["📨 Kafka<br/>Message Queue"]
      B -->|Ingest| C["⚡ Spark Cluster<br/>Real-time Processing"]
      C -->|Process| D["🧠 BERT Microservices<br/>Sentiment & Topic"]
      D -->|Store| E["💾 Feature Store<br/>Historical Features"]
      D -->|Alert| F["🔔 Alert Service<br/>Thresholds & Rules"]
      F -->|Send| G["📊 Analytics Dashboard<br/>Real-time Insights"]
      E -->|Feedback| C`,
    workflow: `graph TD
      A["📥 Raw Stream<br/>Multi-language Posts"] --> B["🌐 Language Detection"]
      B --> C["📝 Tokenization<br/>Preprocessing"]
      C --> D["🧠 BERT Inference<br/>Sentiment & Topic"]
      D --> E["📊 Aggregate Metrics<br/>Rolling Windows"]
      E --> F["🚨 Alert Routing<br/>Threshold Logic"]
      F --> G["📈 Visualization<br/>Real-time Dashboard"]`
  },
  
  'customer-churn-intelligence': {
    architecture: `graph LR
      A["🗄️ Data Lake<br/>Customer Events"] --> B["🔄 Airflow ETL<br/>Orchestration"]
      B -->|Transform| C["📦 Feature Store<br/>Historical Features"]
      C -->|Train| D["🧪 MLflow Registry<br/>Model Versioning"]
      D --> E["🤖 Ensemble Models<br/>XGBoost + CatBoost"]
      E --> F["⚙️ FastAPI Scorer<br/>Live Predictions"]
      F --> G["📊 Analytics Dashboard<br/>Risk Insights"]
      G -->|Feedback| B`,
    workflow: `graph TD
      A["📥 Ingest Data<br/>Raw Customer Events"] --> B["🧹 Clean & Encode<br/>Feature Engineering"]
      B --> C["📚 Train & Validate<br/>Cross-validation"]
      C --> D["✅ Register Model<br/>MLflow Registry"]
      D --> E["🚀 Deploy<br/>FastAPI Service"]
      E --> F["📡 Monitor Drift<br/>Performance Tracking"]
      F -->|Trigger| G["🔄 Retrain Cycle"]`
  },
  
  'brain-tumor-classification': {
    architecture: `graph LR
      A["🏥 PACS/MRI Storage<br/>Medical Images"] --> B["🖼️ Preprocessing<br/>Normalization & Augment"]
      B -->|Process| C["🧠 CNN Cluster<br/>ResNet/EfficientNet"]
      C -->|Explain| D["🔍 Grad-CAM++<br/>Explainability"]
      D -->|Generate| E["📋 Report Generator<br/>PDF Creation"]
      E -->|Send| F["👨‍⚕️ Clinician Portal<br/>Review Interface"]`,
    workflow: `graph TD
      A["📤 MRI Import<br/>DICOM Files"] --> B["⚙️ Normalize<br/>Data Preprocessing"]
      B --> C["🧠 CNN Inference<br/>Tumor Detection"]
      C --> D["🔥 Grad-CAM Heatmap<br/>Attention Maps"]
      D --> E["✔️ QA Review<br/>Manual Verification"]
      E --> F["📄 EMR Export<br/>Clinical Integration"]`
  },
  
  'financial-fraud-detection': {
    architecture: `graph LR
      A["💳 Payment Gateways<br/>Transaction Stream"] -->|Event| B["📨 Kafka Backbone<br/>Event Processing"]
      B -->|Feature Eng| C["🔢 Feature Store<br/>Behavior Patterns"]
      C -->|Score| D["🤖 Autoencoder<br/>Reconstruction Error"]
      C -->|Score| E["🌳 Isolation Forest<br/>Anomaly Detection"]
      D & E -->|Ensemble| F["⚡ Scoring Service<br/>Real-time"]
      F -->|Alert| G["🚨 SOC Dashboard<br/>Analyst Queue"]`,
    workflow: `graph TD
      A["💸 Ingest Transaction<br/>Real-time Stream"] --> B["⚙️ Normalize<br/>Feature Extraction"]
      B --> C["📊 Autoencoder<br/>Reconstruction Error"]
      C --> D["🎯 Threshold Logic<br/>Anomaly Detection"]
      D --> E["📋 Case Creation<br/>Alert Generation"]
      E --> F["👁️ Analyst Review<br/>Feedback Loop"]`
  },
  
  'yolov8-inference-engine': {
    architecture: `graph LR
      A["📹 IP Cameras<br/>WebRTC Streams"] --> B["🔄 Preprocessor<br/>Resizing & Normalization"]
      B -->|Stream| C["🎯 YOLOv8 Nodes<br/>Object Detection"]
      C -->|Optimize| D["⚡ TensorRT<br/>Hardware Acceleration"]
      D -->|Stream| E["🌐 Gateway<br/>RTSP/HLS Output"]
      E -->|Display| F["📊 Monitoring<br/>Live Dashboard"]`,
    workflow: `graph TD
      A["📹 Capture Frame<br/>Camera Input"] --> B["🔀 Decode<br/>Codec Parsing"]
      B --> C["🖼️ Preprocess<br/>Resize & Normalize"]
      C --> D["🎯 YOLOv8 Detection<br/>Model Inference"]
      D --> E["🧹 NMS Post-process<br/>Deduplication"]
      E --> F["✏️ Draw Boxes<br/>Annotation"]
      F --> G["📤 Stream/Archive<br/>Output"]`
  },
  
  'hybrid-recommendation-engine': {
    architecture: `graph LR
      A["👤 User Events<br/>Click & Rating"] -->|Store| B["💾 Feature Store<br/>User-Item Pairs"]
      B -->|Embed| C["🧠 Embedding Layer<br/>Latent Vectors"]
      C -->|Index| D["⚡ FAISS Index<br/>Vector Search"]
      D -->|Retrieve| E["🎯 Candidate Pool<br/>Fast Recall"]
      E -->|Rank| F["📊 NCF + MF Ranker<br/>Neural Reranking"]
      F -->|Diversify| G["🎁 Final Selection<br/>Diversification"]
      G --> H["🚀 Serve API<br/>Real-time Recs"]`,
    workflow: `graph TD
      A["👤 Collect Signals<br/>User Interactions"] --> B["📦 Embed Users/Items<br/>Latent Vectors"]
      B --> C["🔍 Approximate NN<br/>FAISS Search"]
      C --> D["🔄 Rerank<br/>NCF + MF"]
      D --> E["🎯 Diversify<br/>Coverage Optimization"]
      E --> F["📤 Serve<br/>Recommendations"]
      F -->|Feedback| G["📊 Feedback Loop<br/>Model Updates"]`
  },
  
  'demand-forecasting-pipeline': {
    architecture: `graph LR
      A["🏪 Retail Data<br/>Sales History"] -->|ETL| B["⚡ PySpark<br/>Big Data Processing"]
      B -->|Features| C["📦 Feature Store<br/>Time-Series Features"]
      C -->|Train| D["📈 Prophet<br/>Decomposition"]
      C -->|Train| E["🌳 XGBoost<br/>Gradient Boosting"]
      D & E -->|Ensemble| F["🎯 Forecast Service<br/>Predictions"]
      F -->|Results| G["📊 BI Dashboards<br/>Actionable Insights"]`,
    workflow: `graph TD
      A["📥 Ingest Sales<br/>SKU-level Data"] --> B["🧹 Clean & Aggregate<br/>Time-Series"]
      B --> C["⚙️ Feature Engineering<br/>Seasonality & Trends"]
      C --> D["📚 Train Prophet<br/>Decomposition Model"]
      C --> E["📚 Train XGBoost<br/>Gradient Boosting"]
      D & E -->|Combine| F["📊 Ensemble Forecast<br/>Confidence Intervals"]
      F --> G["✔️ Validate<br/>Backtest"]
      G --> H["📈 Publish<br/>Dashboard Updates"]`
  },
  
  'resume-parser': {
    architecture: `graph LR
      A["📄 Resume Upload<br/>PDF/DOCX"] -->|OCR| B["🧹 Cleaning<br/>Text Extraction"]
      B -->|Parse| C["🏷️ NER Module<br/>BERT + spaCy"]
      C -->|Extract| D["💼 Skill Graph<br/>Skill Normalization"]
      D -->|Match| E["🔍 Matching Engine<br/>Job Description Match"]
      E -->|Score| F["👥 Recruiter Dashboard<br/>Ranked Candidates"]`,
    workflow: `graph TD
      A["📥 Upload Resume<br/>Any Format"] --> B["📤 OCR Extraction<br/>Text Parsing"]
      B --> C["🧹 Clean Text<br/>Normalization"]
      C --> D["🏷️ Extract Entities<br/>Roles, Skills, Edu"]
      D --> E["🎯 Normalize Skills<br/>Knowledge Graph"]
      E --> F["🔗 Match Job Desc<br/>Similarity Scoring"]
      F --> G["📊 Generate Score<br/>Candidate Ranking"]`
  },
  
  'cloud-data-warehouse': {
    architecture: `graph LR
      A["📊 Data Sources<br/>APIs, Databases"] -->|Ingest| B["🌊 Cloud Storage<br/>Data Lake"]
      B -->|Transform| C["⚙️ dbt Pipeline<br/>Transformation"]
      C -->|Load| D["🏢 Cloud DW<br/>Snowflake/BigQuery"]
      D -->|Query| E["📈 BI Tools<br/>Analytics"]
      E -->|Results| F["👥 Stakeholders<br/>Insights"]`,
    workflow: `graph TD
      A["🔌 Source Connect<br/>APIs & Databases"] --> B["📥 Extract<br/>Batch or Stream"]
      B --> C["🌊 Stage Data<br/>Cloud Storage"]
      C --> D["⚙️ Transform<br/>dbt Models"]
      D --> E["🗄️ Load DW<br/>Dimension & Facts"]
      E --> F["🔍 Data Quality<br/>Validation"]
      F --> G["📊 Serve Data<br/>Analytics"]`
  },
  
  'quantum-blood-group': {
    architecture: `graph LR
      A["🩸 Blood Sample<br/>Image Input"] --> B["🔄 Preprocess<br/>Normalization"]
      B -->|Classical| C["🧠 CNN<br/>Feature Extraction"]
      C -->|Quantum| D["⚛️ VQC Layer<br/>Qiskit/PennyLane"]
      D -->|Classical| E["🎯 Classifier<br/>Output Layer"]
      E -->|Result| F["📊 Insights<br/>Visualization"]`,
    workflow: `graph TD
      A["📸 Capture Image<br/>Blood Sample"] --> B["⚙️ Normalize<br/>Preprocessing"]
      B --> C["🧠 CNN Extract<br/>Feature Maps"]
      C --> D["⚛️ Quantum Layer<br/>VQC Inference"]
      D --> E["📊 Post-process<br/>Probability"]
      E --> F["✔️ Evaluate<br/>Classification"]`
  }
};
