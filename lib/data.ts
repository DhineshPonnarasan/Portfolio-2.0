import { IProject, IPublication, IEducation, IContribution } from '@/types';
import { MERMAID_DIAGRAMS } from './mermaid-templates';

export const GENERAL_INFO = {
    email: 'dhineshponnarasan@gmail.com',
    phone: '+1 6073128610',
    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Dhinesh, I am reaching out to you because...',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/DhineshPonnarasan' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/dhinesh-s-p' },
    { name: 'leetcode', url: 'https://leetcode.com/u/Dhinesh_Ponnarasan/' },
    { name: 'scholar', url: 'https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=O5o69CgAAAAJ&sortby=pubdate' },
];

export const MY_STACK = {
    'Programming Languages': [
        {
            name: 'Python',
            icon: '/logo/python.svg',
        },
        {
            name: 'Java',
            icon: '/logo/java.svg',
        },
        {
            name: 'C',
            icon: '/logo/C.png',
        },
        {
            name: 'C++',
            icon: '/logo/cplusplus.svg',
        },
        {
            name: 'JavaScript',
            icon: '/logo/javascript.svg',
        },
        {
            name: 'TypeScript',
            icon: '/logo/typescript.svg',
        },
        {
            name: 'SQL',
            icon: '/logo/sql.svg',
        },
        {
            name: 'R',
            icon: '/logo/r.svg',
        },
    ],
    'Machine Learning & AI': [
        {
            name: 'Scikit-learn',
            icon: '/logo/scikit-learn.svg',
        },
        {
            name: 'XGBoost',
            icon: '/logo/xgboost.svg',
        },
        {
            name: 'Random Forest',
            icon: '/logo/random-forest.svg',
        },
        {
            name: 'SVM',
            icon: '/logo/svm.svg',
        },
        {
            name: 'LightGBM',
            icon: '/logo/lightgbm.svg',
        },
        {
            name: 'CatBoost',
            icon: '/logo/catboost.svg',
        },
        {
            name: 'AutoML',
            icon: '/logo/automl.svg',
        },
        {
            name: 'MLflow',
            icon: '/logo/mlflow.svg',
        },
        {
            name: 'Hyperparameter Tuning',
            icon: '/logo/hyperparameter-tuning.svg',
        },
        {
            name: 'Model Selection',
            icon: '/logo/model-selection.svg',
        },
        {
            name: 'Feature Engineering',
            icon: '/logo/feature-engineering.svg',
        },
        {
            name: 'Ensemble Methods',
            icon: '/logo/ensemble-methods.svg',
        },
        {
            name: 'LangChain',
            icon: '/logo/langchain.svg',
        },
        {
            name: 'LlamaIndex',
            icon: '/logo/llamaindex.svg',
        },
        {
            name: 'RAG Architecture',
            icon: '/logo/rag-architecture.svg',
        },
    ],
    'Deep Learning & Neural Networks': [
        {
            name: 'TensorFlow',
            icon: '/logo/tensorflow.svg',
        },
        {
            name: 'PyTorch',
            icon: '/logo/pytorch.svg',
        },
        {
            name: 'Keras',
            icon: '/logo/keras.svg',
        },
        {
            name: 'CNN',
            icon: '/logo/cnn.svg',
        },
        {
            name: 'RNN/LSTM/GRU',
            icon: '/logo/rnn-lstm-gru.svg',
        },
        {
            name: 'GANs',
            icon: '/logo/gans.svg',
        },
        {
            name: 'Transformers',
            icon: '/logo/transformers.svg',
        },
        {
            name: 'BERT',
            icon: '/logo/bert.svg',
        },
        {
            name: 'GPT',
            icon: '/logo/gpt.svg',
        },
        {
            name: 'ResNet',
            icon: '/logo/resnet.svg',
        },
        {
            name: 'U-Net',
            icon: '/logo/u-net.svg',
        },
        {
            name: 'YOLO',
            icon: '/logo/yolo.svg',
        },
        {
            name: 'TensorRT',
            icon: '/logo/tensorrt.svg',
        },
        {
            name: 'HuggingFace',
            icon: '/logo/huggingface.svg',
        },
    ],
    'Computer Vision': [
        {
            name: 'OpenCV',
            icon: '/logo/opencv.svg',
        },
        {
            name: 'PIL/Pillow',
            icon: '/logo/pil-pillow.svg',
        },
        {
            name: 'ImageIO',
            icon: '/logo/imageio.svg',
        },
        {
            name: 'Albumentations',
            icon: '/logo/albumentations.svg',
        },
        {
            name: 'MediaPipe',
            icon: '/logo/mediapipe.svg',
        },
        {
            name: 'YOLOv8',
            icon: '/logo/yolov8.svg',
        },
        {
            name: 'Object Detection',
            icon: '/logo/object-detection.svg',
        },
        {
            name: 'Image Segmentation',
            icon: '/logo/image-segmentation.svg',
        },
        {
            name: 'Face Recognition',
            icon: '/logo/face-recognition.svg',
        },
        {
            name: 'OCR',
            icon: '/logo/ocr.svg',
        },
    ],
    'Data Science & Analytics': [
        {
            name: 'NumPy',
            icon: '/logo/numpy.svg',
        },
        {
            name: 'Pandas',
            icon: '/logo/pandas.svg',
        },
        {
            name: 'Matplotlib',
            icon: '/logo/matplotlib.svg',
        },
        {
            name: 'Seaborn',
            icon: '/logo/seaborn.svg',
        },
        {
            name: 'Plotly',
            icon: '/logo/plotly.svg',
        },
        {
            name: 'Kaggle',
            icon: '/logo/kaggle.svg',
        },
        {
            name: 'Jupyter',
            icon: '/logo/jupyter.svg',
        },
        {
            name: 'Google Colab',
            icon: '/logo/google-colab.svg',
        },
        {
            name: 'SciPy',
            icon: '/logo/scipy.svg',
        },
        {
            name: 'Statsmodels',
            icon: '/logo/statsmodels.svg',
        },
        {
            name: 'BeautifulSoup',
            icon: '/logo/beautifulsoup.svg',
        },
        {
            name: 'Scrapy',
            icon: '/logo/scrapy.svg',
        },
        {
            name: 'Power BI',
            icon: '/logo/power-bi.svg',
        },
        {
            name: 'Tableau',
            icon: '/logo/tableau.svg',
        },
        {
            name: 'ETL',
            icon: '/logo/etl.png',
        },
        {
            name: 'MLOps',
            icon: '/logo/mlops.png',
        },
        {
            name: 'A/B Testing',
            icon: '/logo/ab-testing.png',
        },
    ],
    'Big Data & Cloud Platforms': [
        {
            name: 'Apache Spark',
            icon: '/logo/apache-spark.svg',
        },
        {
            name: 'Apache Kafka',
            icon: '/logo/apache-kafka.svg',
        },
        {
            name: 'Hadoop',
            icon: '/logo/hadoop.svg',
        },
        {
            name: 'dbt',
            icon: '/logo/dbt.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.svg',
        },
        {
            name: 'Google Cloud',
            icon: '/logo/google-cloud.svg',
        },
        {
            name: 'Azure',
            icon: '/logo/azure.svg',
        },
        {
            name: 'Databricks',
            icon: '/logo/databricks.svg',
        },
        {
            name: 'Snowflake',
            icon: '/logo/snowflake.svg',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'Kubernetes',
            icon: '/logo/kubernetes.svg',
        },
        {
            name: 'AWS SageMaker',
            icon: '/logo/aws-sagemaker.svg',
        },
        {
            name: 'Supabase',
            icon: '/logo/supabase.svg',
        },
    ],
    'Databases & Storage': [
        {
            name: 'PostgreSQL',
            icon: '/logo/postgresql.svg',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'Redis',
            icon: '/logo/redis.svg',
        },
        {
            name: 'Elasticsearch',
            icon: '/logo/elasticsearch.svg',
        },
        {
            name: 'MySQL',
            icon: '/logo/mysql.svg',
        },
        {
            name: 'SQLite',
            icon: '/logo/sqlite.svg',
        },
        {
            name: 'Cassandra',
            icon: '/logo/cassandra.svg',
        },
    ],
    'Development & Deployment': [
        {
            name: 'FastAPI',
            icon: '/logo/fastapi.svg',
        },
        {
            name: 'Flask',
            icon: '/logo/flask.svg',
        },
        {
            name: 'Django',
            icon: '/logo/django.svg',
        },
        {
            name: 'Streamlit',
            icon: '/logo/streamlit.svg',
        },
        {
            name: 'Postman',
            icon: '/logo/postman-icon.svg',
        },
        {
            name: 'Next.js',
            icon: '/logo/next-js.svg',
        },
        {
            name: 'React',
            icon: '/logo/react.svg',
        },
        {
            name: 'Node.js',
            icon: '/logo/node-js.svg',
        },
        {
            name: 'GitHub',
            icon: '/logo/github.svg',
        },
        {
            name: 'Git',
            icon: '/logo/git.svg',
        },
        {
            name: 'CI/CD',
            icon: '/logo/ci-cd.svg',
        },
        {
            name: 'API Development',
            icon: '/logo/api-development.svg',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind-css.svg',
        },
        {
            name: 'Jira',
            icon: '/logo/jira.svg',
        },
        {
            name: 'Render',
            icon: '/logo/render-official.svg',
        },
        {
            name: 'Vercel',
            icon: '/logo/vercel-black.svg',
        },
    ],
};

export const PROJECTS: IProject[] = [
    // 1. Customer Churn Decision Intelligence System
    {
        id: 1,
        title: "Customer Churn Decision Intelligence System",
        slug: "customer-churn-intelligence",
        year: 2024,
        visuals: [],
        techAndTechniques: [
            "🧬 Gradient Boosting Ensemble (XGBoost, CatBoost)",
            "📊 MLflow Experiment Tracking & Model Registry",
            "🔄 Airflow Automated Retraining + Drift Monitoring",
            "📈 SHAP Explainability",
            "⚡ Real-Time Scoring with FastAPI",
            "🧹 Data Engineering Pipelines (ETL + Feature Store)"
        ],
        description: [
            "Built to proactively identify high-risk customers before churn occurs, enabling data-driven retention strategies.",
            "Uses ensemble boosting models to capture non-linear churn indicators and complex user patterns.",
            "SHAP explainability reveals why users churn, helping non-technical teams take effective action.",
            "MLflow manages full model lifecycle, ensuring reproducibility, traceability, and version safety.",
            "Automated Airflow pipelines perform retraining, drift detection, and scheduled monitoring.",
            "Real-time prediction layer enables immediate scoring at user interaction points.",
            "Engineered with modular components suitable for enterprise-scale deployment."
        ],
        metrics: [
            "✅ 21% improvement in prediction accuracy over baseline models.",
            "✅ <50 ms API latency for real-time scoring.",
            "✅ 38% reduction in performance decay through automated drift monitoring."
        ],
        keyFeatures: [
            "🔍 SHAP-based interpretable AI",
            "🔄 Automated retraining workflows",
            "⚡ Real-time scoring API",
            "🛡️ Robust drift detection pipeline"
        ],
        skills: [
            "Python, FastAPI, MLflow, Airflow",
            "XGBoost, CatBoost, SHAP",
            "Pandas, NumPy, Scikit-learn",
            "Docker, CI/CD, Cloud Deployment"
        ],
        interestingHighlights: [
            "🔍 Converts raw predictions into actionable business insights.",
            "🧩 Highly modular design enables plug-and-play model experimentation.",
            "🚀 Built to operate continuously with minimal human intervention."
        ]
    },
    // 2. Large-Scale Social Media Sentiment Intelligence Platform
    {
        id: 2,
        title: "Large-Scale Social Media Sentiment Intelligence Platform",
        slug: "social-media-sentiment",
        year: 2024,
        visuals: [],
        techAndTechniques: [
            "🌊 Spark Streaming + Kafka Real-Time Pipeline",
            "🧠 Transformer Models (BERT, Multilingual BERT)",
            "🚀 Microservices Autoscaling Architecture",
            "📚 Topic Modeling + Sentiment Classification",
            "📊 Real-Time Dashboarding (BI Visualization)"
        ],
        description: [
            "Processes millions of social media posts in real time to capture public sentiment shifts instantly.",
            "Spark Streaming powers high-throughput ingestion and distributed text transformation.",
            "Fine-tuned transformer models deliver context-sensitive sentiment and topic detection.",
            "Kafka handles high-velocity data pipelines with guaranteed delivery.",
            "Autoscaling microservices respond dynamically to social event spikes.",
            "Dashboards provide real-time visibility into brand reputation and emerging topics.",
            "Designed for global-scale workloads with multilingual capability."
        ],
        metrics: [
            "📊 2.5M+ posts/hour processing throughput.",
            "📊 17% improvement in sentiment accuracy after custom BERT fine-tuning.",
            "📊 <1 second end-to-end latency for streaming inference.",
            "📊 28% cost reduction through intelligent autoscaling."
        ],
        keyFeatures: [
            "🌍 Multilingual sentiment + topic classification",
            "⚡ Streaming data processing with fault tolerance",
            "📈 Real-time trend monitoring and alerts",
            "🔧 Microservices with autoscaling"
        ],
        skills: [
            "Python, PySpark, Kafka",
            "BERT, HuggingFace Transformers",
            "Docker, Kubernetes",
            "Power BI / Grafana dashboards"
        ],
        interestingHighlights: [
            "📈 Detects viral trends before they peak.",
            "🎯 Designed to handle unpredictable surge patterns such as political events or celebrity news."
        ]
    },
    // 3. Deep Learning Brain Tumor Classification
    {
        id: 3,
        title: "Deep Learning Brain Tumor Classification",
        slug: "brain-tumor-classification",
        year: 2025,
        visuals: [],
        techAndTechniques: [
            "🧬 EfficientNet / ResNet CNN Architectures",
            "🔥 Grad-CAM++ Visual Explainability",
            "🤖 TensorFlow + Computer Vision",
            "🖼️ Medical Image Preprocessing Pipelines",
            "📦 Containerized Model Deployment"
        ],
        description: [
            "🧬 Classifies brain tumor types from MRI scans with near-clinical precision.",
            "🧠 Advanced CNNs extract deep spatial features from complex medical imagery.",
            "🔥 Grad-CAM++ provides interpretable tumor-region heatmaps for radiologist review.",
            "🔄 Data augmentation ensures robustness across MRI devices and noise variations.",
            "📦 Containerized inference enables seamless integration into hospital systems.",
            "⚡ Optimized for GPU processing with fast inference speeds.",
            "👨‍⚕️ Designed to support doctors with AI-driven secondary diagnosis."
        ],
        metrics: [
            "📊 98.2% classification accuracy on MRI dataset.",
            "⚡ ~90 ms inference per scan on GPU.",
            "🧠 33% improvement in interpretability quality with Grad-CAM++."
        ],
        keyFeatures: [
            "⭐ High-precision deep learning classification",
            "⭐ Medical-grade explainability",
            "⭐ Fast, scalable inference service"
        ],
        skills: [
            "🛠️ Python, TensorFlow, Keras",
            "🛠️ OpenCV, NumPy",
            "🛠️ FastAPI, Docker",
            "🛠️ GPU-accelerated processing"
        ],
        interestingHighlights: [
            "✨ Bridges AI and radiology by providing interpretable model decisions.",
            "✨ Enables faster diagnosis in emergency imaging workflows."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 4. Financial Fraud Detection Engine
    {
        id: 4,
        title: "Financial Fraud Detection Engine",
        slug: "financial-fraud-detection",
        year: 2024,
        visuals: [],
        techAndTechniques: [
            "🧬 Autoencoder + Isolation Forest Hybrid Modeling",
            "🛠️ Behavioral Feature Engineering",
            "📡 Kafka-Based Real-Time Streaming",
            "🚨 Anomaly Detection Algorithms",
            "⚡ Real-time Scoring APIs"
        ],
        description: [
            "🛡️ Detects fraudulent transactions in real time by learning normal financial behavior patterns.",
            "🔍 Autoencoders reconstruct legitimate patterns while identifying deviations as anomalies.",
            "🌲 Isolation Forest boosts detection of rare fraudulent events.",
            "⚡ Kafka streams enable millions of transactions to be scored instantly.",
            "🧠 Behavioral features enhance understanding of user spending patterns.",
            "🔄 System continuously adapts to evolving fraud signatures.",
            "🚀 Designed for mission-critical financial systems requiring precision + speed."
        ],
        metrics: [
            "📊 27% reduction in false positives.",
            "⚡ 18 ms average scoring latency.",
            "🧠 3.2× increase in new/unseen fraud detection."
        ],
        keyFeatures: [
            "⭐ Real-time anomaly detection",
            "⭐ High-throughput streaming architecture",
            "⭐ Behavior-based feature mapping"
        ],
        skills: [
            "🛠️ Python, TensorFlow, Scikit-learn",
            "🛠️ Kafka, FastAPI",
            "🛠️ Docker, CI/CD",
            "🛠️ Feature Engineering, Data Pipelines"
        ],
        interestingHighlights: [
            "✨ Designed to evolve with new fraud patterns, not rely on outdated rules.",
            "✨ Suitable for banks, fintech apps, and high-volume trading platforms."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 5. YOLOv8 Real-Time Vision Inference Engine
    {
        id: 5,
        title: "YOLOv8 Real-Time Vision Inference Engine",
        slug: "yolov8-inference-engine",
        year: 2024,
        visuals: [],
        techAndTechniques: [
            "🎯 YOLOv8 Object Detection",
            "⚡ TensorRT Hardware Acceleration",
            "🖥️ Computer Vision Optimization",
            "📡 WebRTC + FastAPI Streaming",
            "🌐 Edge Inference Deployment"
        ],
        description: [
            "🤖 Provides high-FPS real-time object detection for robotics and surveillance applications.",
            "⚡ TensorRT acceleration boosts YOLOv8 performance significantly on GPU and edge hardware.",
            "📡 WebRTC integration enables ultra-low-latency live video streaming.",
            "🖥️ Supports edge devices like Jetson for portable, efficient deployment.",
            "🔄 Uses augmentation strategies to improve model robustness.",
            "⏱️ Designed for environments where milliseconds decide safety outcomes.",
            "📈 Highly scalable for enterprise vision analytics."
        ],
        metrics: [
            "📊 FPS improved from 18 → 55 after TensorRT optimization.",
            "⚡ Latency reduced by 64% on edge hardware.",
            "🎯 14% increase in detection precision with custom augmentation."
        ],
        keyFeatures: [
            "⭐ High-FPS object detection",
            "⭐ Hardware-accelerated inference",
            "⭐ Low-latency video analytics pipeline"
        ],
        skills: [
            "🛠️ Python, PyTorch, OpenCV",
            "🛠️ TensorRT, CUDA",
            "🛠️ FastAPI, WebRTC",
            "🛠️ Edge device optimization"
        ],
        interestingHighlights: [
            "✨ Enables near-instant decision-making in real-world robotics.",
            "✨ Designed to run efficiently even with limited hardware resources."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 6. Hybrid Recommendation Engine
    {
        id: 6,
        title: "Hybrid Recommendation Engine",
        slug: "hybrid-recommendation-engine",
        year: 2024,
        visuals: [],
        techAndTechniques: [
            "🧩 Matrix Factorization + Neural Collaborative Filtering",
            "🔎 FAISS Vector Similarity Search",
            "🏅 Ranking Algorithms",
            "🧬 Embedding Engineering",
            "⚡ Real-Time Recommendation Inference"
        ],
        description: [
            "⭐ Generates personalized recommendations using a hybrid architecture combining MF and NCF.",
            "⚡ FAISS provides millisecond-level retrieval from millions of embeddings.",
            "📈 Ranking algorithms refine recommendations for better user relevance.",
            "🧊 Handles cold-start users through hybrid modeling.",
            "🏢 Built for scalable content platforms requiring instant personalization.",
            "🔍 Embedding optimization improves long-tail item discovery.",
            "🔄 Supports continuous real-time updates as user behavior shifts."
        ],
        metrics: [
            "📊 35% improvement in MAP@10 ranking relevance.",
            "⚡ <10 ms FAISS search latency.",
            "🎯 22% increase in cold-start recommendation accuracy."
        ],
        keyFeatures: [
            "⭐ Real-time vector search",
            "⭐ Personalized ranking pipeline",
            "⭐ Hybrid neural + classical modeling"
        ],
        skills: [
            "🛠️ Python, PyTorch",
            "🛠️ FAISS, NumPy",
            "🛠️ FastAPI",
            "🛠️ Docker, microservices"
        ],
        interestingHighlights: [
            "✨ Built for large-scale catalog systems like Netflix/Spotify.",
            "✨ Strong performance even with sparse data."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 7. Big Data Demand Forecasting Pipeline
    {
        id: 7,
        title: "Big Data Demand Forecasting Pipeline",
        slug: "demand-forecasting-pipeline",
        year: 2024,
        visuals: [],
        techAndTechniques: [
            "🔥 PySpark Large-Scale ETL",
            "🔮 Prophet + XGBoost Hybrid Forecasting",
            "📈 Hierarchical Time-Series Modeling",
            "🚨 Anomaly Detection",
            "📊 Automated Reporting Dashboards"
        ],
        description: [
            "📊 Predicts retail demand across millions of rows and hundreds of SKUs.",
            "⚡ PySpark performs distributed feature engineering and processing.",
            "🔮 Hybrid Prophet-XGBoost models capture trends, seasonality, and nonlinear interactions.",
            "🏷️ Hierarchical models support predictions from brand → category → SKU.",
            "🚨 Automated anomaly detection flags unexpected sales spikes or drops.",
            "📈 BI dashboards provide interpretable demand trends.",
            "🏢 Scalable architecture built for enterprise-level forecasting."
        ],
        metrics: [
            "📊 18% improvement in forecast accuracy.",
            "⚡ 40% reduction in ETL processing time.",
            "🎯 92% anomaly detection precision on sales fluctuations."
        ],
        keyFeatures: [
            "⭐ Hierarchical forecasting engine",
            "⭐ Scalable PySpark ETL",
            "⭐ Automated anomaly monitoring"
        ],
        skills: [
            "🛠️ Python, SQL",
            "🛠️ PySpark, XGBoost, Prophet",
            "🛠️ Airflow, Docker",
            "🛠️ Databricks, Power BI"
        ],
        interestingHighlights: [
            "✨ Helps retailers reduce stockouts and overstocking dramatically.",
            "✨ Handles extreme seasonality (festivals, promotions, weather spikes)."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 8. Intelligent Resume Parser & Skill Extraction
    {
        id: 8,
        title: "Intelligent Resume Parser & Skill Extraction",
        slug: "resume-parser",
        year: 2023,
        visuals: [],
        techAndTechniques: [
            "🤖 BERT + spaCy NER Pipelines",
            "🔗 Semantic Similarity Modeling",
            "📝 Rule-Based Post-Processing",
            "🏅 Custom Candidate Ranking Algorithms",
            "🧹 Resume Text Normalization"
        ],
        description: [
            "💼🤖 Extracts skills, roles, experience, and education using transformer-powered NLP.",
            "🧠 BERT enables context-aware understanding of candidate profiles.",
            "🔗 Semantic similarity scoring matches resumes to job descriptions effectively.",
            "📊 Custom ranking algorithm evaluates candidate-job fit across multiple features.",
            "📄 Handles diverse resume formats (PDF, DOCX, text).",
            "🌍 Robust parser designed for global multi-domain resumes.",
            "⚡ Enables faster shortlisting and candidate filtering."
        ],
        metrics: [
            "📊 92–95% extraction accuracy across resume types.",
            "📈 31% improvement in matching precision with semantic scoring.",
            "⚡ <1 second average processing time per resume."
        ],
        keyFeatures: [
            "⭐ Transformer-driven NER",
            "⭐ Ranking-based candidate scoring",
            "⭐ Multi-format resume ingestion"
        ],
        skills: [
            "🛠️ Python, spaCy, Transformers",
            "🛠️ Sentence-BERT, NumPy",
            "🛠️ FastAPI, Docker"
        ],
        interestingHighlights: [
            "✨ Mimics a recruiter’s reading logic using AI.",
            "✨ Can process thousands of resumes in minutes."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 9. Cloud-Native Data Warehouse & ETL System
    {
        id: 9,
        title: "Cloud-Native Data Warehouse & ETL System",
        slug: "cloud-data-warehouse",
        year: 2023,
        visuals: [],
        techAndTechniques: [
            "☁️ Snowflake + BigQuery Cloud Warehousing",
            "🛠️ dbt Transformations (Modular SQL Pipelines)",
            "🔄 Airflow ETL Orchestration",
            "📊 Dimensional Modeling (Fact/Dim Schema)",
            "🧪 Data Quality Testing"
        ],
        description: [
            "☁️📡 Migrates legacy data systems into a cloud-native warehouse for faster analytics.",
            "🛠️ dbt provides version-controlled, tested SQL transformations for reliability.",
            "🔄 Airflow orchestrates ingestion, cleaning, modeling, and delivery.",
            "📊 Dimensional schemas enable performant BI queries.",
            "🧪 Automated data quality tests prevent corrupted data from reaching dashboards.",
            "🚀 Improves analyst productivity with centralized, consistent data.",
            "🏢 Built to scale for enterprise workloads."
        ],
        metrics: [
            "📊 60% reduction in query time post-migration.",
            "⚡ Data freshness improved from daily → hourly.",
            "🧪 98% anomaly detection accuracy in data quality tests."
        ],
        keyFeatures: [
            "⭐ Modular dbt pipelines",
            "⭐ Cloud-native storage & compute",
            "⭐ Scalable ETL orchestration"
        ],
        skills: [
            "🛠️ SQL, Python",
            "🛠️ dbt, Airflow",
            "🛠️ Snowflake / BigQuery",
            "🛠️ Docker, CI/CD"
        ],
        interestingHighlights: [
            "✨ Enables self-service BI for cross-functional teams.",
            "✨ Ensures consistent “single source of truth” for analytics."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    },
    // 10. Blood Group Classification Using Quantum Deep Learning
    {
        id: 10,
        title: "Blood Group Classification Using Quantum Deep Learning",
        slug: "quantum-blood-group",
        year: 2023,
        visuals: [],
        techAndTechniques: [
            "⚛️ Quantum Machine Learning (QML)",
            "🔗 Variational Quantum Circuits (VQC)",
            "🧬 Pennylane + Qiskit Quantum Layers",
            "🖼️ CNN-Based Feature Extraction",
            "🤝 Hybrid Classical–Quantum Modeling"
        ],
        description: [
            "⚛️🩸 Explores quantum ML for biomedical image classification using hybrid quantum–classical models.",
            "🧠 CNN extracts spatial features while quantum circuits capture higher-order data interactions.",
            "🔗 VQCs introduce quantum entanglement-based learning dynamics.",
            "🌪️ Simulated quantum noise models enhance robustness.",
            "🧪 Designed to test the boundaries of classical ML vs QML performance.",
            "🚀 Demonstrates potential early-stage benefits of quantum learning in healthcare.",
            "🔬 Showcases integration of quantum circuits into deep learning workflow."
        ],
        metrics: [
            "📊 11% accuracy improvement vs classical CNN baseline.",
            "⚡ 19% reduction in required training iterations.",
            "🧪 25% increase in stability under simulated quantum noise."
        ],
        keyFeatures: [
            "⭐ Hybrid quantum–classical architecture",
            "⭐ Quantum-enhanced feature transformation",
            "⭐ Noise-resilient circuit simulation"
        ],
        skills: [
            "🛠️ Python, PyTorch",
            "🛠️ Pennylane, Qiskit",
            "🛠️ Docker, Quantum Simulation Tools"
        ],
        interestingHighlights: [
            "✨ Pushes boundaries of next-generation AI.",
            "✨ Demonstrates feasibility of real-world QML integration."
        ],
        // visuals, architectureDiagram, and workflowDiagram removed
    }
];

    export const MY_CONTRIBUTIONS: IContribution[] = [
        {
            title: 'Google Season of Docs (GSoD \'22)',
            slug: 'google-season-of-docs',
            org: 'Wechaty',
            role: 'Student Developer',
            period: 'Feb 2022 – May 2022',
            description: "Contributed to Wechaty's documentation and developer experience through a redesigned landing page and improved onboarding flows.",
            points: [
                'Designed and implemented the new Wechaty landing page improving clarity, navigation, and onboarding experience.',
                'Streamlined documentation workflows, reorganizing components, examples, and API references for developer usability.',
                'Improved React-based UI components for responsiveness and multilingual support.',
                'Collaborated with maintainers to review PRs and fix documentation inconsistencies.',
            ],
            deepDivePoints: [
                'Redesigned the landing page IA and React layout to reduce onboarding friction.',
                'Refactored documentation structure and component templates for consistency.',
                'Partnered with maintainers to triage PRs and eliminate doc regressions.',
            ],
            link: 'https://wechaty.js.org/',
        },
        {
            title: 'Social Winter of Code (SWoC \'26)',
            slug: 'social-winter-of-code',
            org: 'SWoC',
            role: 'Open Source Developer',
            period: 'Jan 2026 – Mar 2026',
            description: 'Built features, resolved issues, and contributed ML-based enhancements as part of the open-source program.',
            points: [
                'Developed an open-source ML/CV module titled **“Crowd Density Estimation System”** using YOLO + CSRNet for safety analytics.',
                'Added pipeline automation for dataset preprocessing and augmentation.',
                'Improved project structure with modular training scripts and reproducible experiment logging.',
                'Fixed reported issues, refactored code, and enhanced documentation for contributors.',
            ],
            deepDivePoints: [
                'Delivered the Crowd Density Estimation System using YOLO + CSRNet.',
                'Automated data prep and augmentation pipelines for reproducible runs.',
                'Resolved contributor issues and tightened docs to speed onboarding.',
            ],
            link: 'https://github.com/SWOC',
        },
        {
            title: 'Amazon SageMaker – OSS Contribution',
            slug: 'amazon-sagemaker',
            org: 'Amazon AI / AWS',
            role: 'Contributor',
            period: 'Open Contribution',
            description: 'Contributed fixes, patches, and enhancements to the open-source SageMaker examples repo.',
            points: [
                'Resolved issues related to broken training script examples and outdated SDK usage.',
                'Improved Jupyter notebook workflows for ML pipelines and hyperparameter tuning.',
                'Updated documentation for model training, deployment, and inference examples.',
            ],
            deepDivePoints: [
                'Patched SageMaker example notebooks and scripts to align with latest SDK.',
                'Refined pipeline + HPO workflows for clearer end-to-end reproducibility.',
                'Documented deployment/inference patterns to reduce ramp-up time.',
            ],
            link: 'https://github.com/DhineshPonnarasan/amazon-sagemaker',
        },
        {
            title: 'TensorFlow – OSS Contribution',
            slug: 'tensorflow',
            org: 'Google DeepMind',
            role: 'Contributor',
            period: 'Open Contribution',
            description: 'Made contributions to TensorFlow through bug fixes, documentation updates, and reproducibility improvements.',
            points: [
                'Fixed minor implementation errors in model examples and unit tests.',
                'Improved documentation clarity for tf.data pipelines and Keras model training.',
                'Contributed example corrections for CNN/RNN implementations.',
            ],
            deepDivePoints: [
                'Debugged TensorFlow sample models and reinforced test coverage.',
                'Clarified tf.data + Keras training docs for production-readiness.',
                'Updated CNN/RNN walkthroughs to prevent config mistakes.',
            ],
            link: 'https://github.com/DhineshPonnarasan/tensorflow',
        },
        {
            title: 'PyTorch – OSS Contribution',
            slug: 'pytorch',
            org: 'Meta AI',
            role: 'Contributor',
            period: 'Open Contribution',
            description: 'Contributed patches and documentation improvements to PyTorch ecosystem libraries.',
            points: [
                'Fixed preprocessing inconsistencies in torchvision model examples.',
                'Updated training loop documentation with clearer explanation of autograd mechanics.',
                'Assisted in resolving small issues related to function annotations and tensor operations.',
            ],
            deepDivePoints: [
                'Audited torchvision examples to align preprocessing + augmentations.',
                'Clarified autograd + training loop docs for easier contributor ramp.',
                'Closed minor tensor annotation issues to stabilize tutorials.',
            ],
            link: 'https://github.com/DhineshPonnarasan/pytorch',
        },
        {
            title: 'Keras – OSS Contribution',
            slug: 'keras',
            org: 'Google DeepMind',
            role: 'Contributor',
            period: 'Open Contribution',
            description: 'Improved example code quality and documentation for Keras deep learning APIs.',
            points: [
                'Updated sample scripts for image classification and sequence modeling.',
                'Enhanced explanation of functional API and callback usage for model training.',
                'Fixed inconsistencies in preprocessing layers and documentation formatting.',
            ],
            deepDivePoints: [
                'Refreshed Keras sample projects across vision + sequence domains.',
                'Expanded functional API + callback guidance for production teams.',
                'Normalized preprocessing docs to prevent mismatched pipelines.',
            ],
            link: 'https://github.com/DhineshPonnarasan/keras',
        },
        {
            title: 'NumPy – OSS Contribution',
            slug: 'numpy',
            org: 'NumPy Community',
            role: 'Contributor',
            period: 'Open Contribution',
            description: 'Contributed small fixes and improvements to NumPy core and documentation.',
            points: [
                'Fixed documentation inaccuracies for array operations and broadcasting.',
                'Enhanced beginner tutorials by updating outdated code snippets.',
                'Submitted patches addressing minor type definition and error-handling issues.',
            ],
            deepDivePoints: [
                'Corrected NumPy array ops documentation and broadcast notes.',
                'Modernized tutorial snippets for new contributors.',
                'Shipped defensive fixes in type hints + error handling.',
            ],
            link: 'https://github.com/DhineshPonnarasan/numpy',
        },
    ];

export const MY_PUBLICATIONS: IPublication[] = [
    {
        title: 'Unsupervised Anomaly Detection for Network Intrusion Using Deep Autoencoders',
        venue: '2025 International Conference on Next Generation Computing Systems (ICNGCS)',
        year: 2025,
        link: 'https://ieeexplore.ieee.org/document/11182931',
        points: [
            'Hybrid unsupervised intrusion detection combining deep autoencoders with adaptive z-score filtering for dynamic anomaly thresholding.',
            'Achieved 91.4% accuracy and improved performance by 8–15% compared to Isolation Forest, One-Class SVM, and classical statistical approaches.',
            'Evaluated on 125,973 diverse network traffic samples including DoS, Probe, R2L, and U2R attacks.',
            'Real-world deployment across enterprise, academic, and cloud networks showing 67% fewer false positives and SIEM integration with Splunk, QRadar, and ArcSight.',
        ],
    },
    {
        title: 'Collaborative Search With Knowledge Sharing And Summarization',
        venue: '2024 4th International Conference on Sustainable Expert Systems (ICSES)',
        year: 2024,
        link: 'https://ieeexplore.ieee.org/document/10763244',
        points: [
            'Built a collaborative search engine that re-ranks results based on user behavior including scroll depth, time spent, and click-through patterns.',
            'Implemented extractive summarization using MIS and eigenvector centrality to generate concise document summaries.',
            'Enabled knowledge sharing so users in a group can view and benefit from each other\'s interactions and ranking signals.',
            'Demonstrated improvements in search relevance and faster retrieval for multi-user research workflows.',
        ],
    },
    {
        title: 'Image to Audio Conversion to Aid Visually Impaired People using CNN',
        venue: '2023 4th International Conference on Electronics and Sustainable Communication Systems (ICESC)',
        year: 2023,
        link: 'https://ieeexplore.ieee.org/document/10193308',
        points: [
            'Developed a deep-learning-based image-to-audio conversion system providing real-time audio descriptions for visually impaired users.',
            'Used CNN-based feature extraction combined with speech generation for object recognition and scene understanding.',
            'Built a mobile-friendly interface enabling users to easily capture images and receive audio interpretation.',
            'Validated through user studies showing high accuracy and major improvements in usability and daily navigation.',
        ],
    },
];

export const MY_EDUCATION: IEducation[] = [
    {
        institution: 'State University of New York at Binghamton',
        location: 'Binghamton, New York, United States',
        degree: 'Master of Science - Information Systems with Applied Data Science',
        gpa: '3.21/4.00',
        duration: 'August 2024 – Present',
        coursework:
            'Machine Learning, Generative AI, Python, JavaScript, API Development, Natural Language Processing, Deep Learning',
    },
    {
        institution: 'Vellore Institute of Technology',
        location: 'Bangalore, Karnataka,India',
        degree: 'Post Graduate Program - Data Science',
        gpa: '3.36/4.00',
        duration: 'August 2023 – June 2024',
        coursework:
            'Data Structures and Algorithms, Big Data, Artificial Intelligence, C/C++ Programming, Database, Data visualization',
    },
    {
        institution: 'Sri Krishna Arts and Science College',
        location: 'Coimbatore, Tamilnadu. India',
        degree: 'Bachelor of Computer Applications',
        gpa: '3.20/4.00',
        duration: 'April 2019 – June 2022',
        coursework:
            'Operating Systems, Distributed Systems, PHP/MySql, Digital Fundamentals and Architecure, Ethical Hacking, Computer Networks',
    },
    {
        institution: 'SRV Matriculation Higher Secondary School',
        location: 'Trichy, Tamilnadu, India',
        degree: 'High School - Computer Science',
        gpa: 'Percentage - 84%',
        duration: 'June 2017 - March 2019',
        coursework:
            'Literature, Mathemtics, Computer Science, Physics, Chemistry',
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'AI/ML & Applications Development Intern',
        company: 'Uplifty AI',
        duration: 'Aug 2025 – Present',
        location: 'Austin, Texas, United States',
        description: `
        <ul>
            <li>Contributed to the development of AI-powered productivity and automation applications by implementing new product features, resolving functional bugs, and improving UI responsiveness across web and mobile components.</li>
            <li>Built end-to-end machine learning workflows in Python using TensorFlow, scikit-learn, and SQL, converting business problems into classification, ranking, and NLP modeling tasks integrated into Uplifty’s microservices.</li>
            <li>Developed backend features using FastAPI, optimized API response pipelines, and integrated ML outputs into production systems while collaborating with the engineering team for smooth deployment.</li>
            <li>Enhanced application reliability by contributing to frontend components (React/Next.js) and backend services, implementing data preprocessing, feature engineering, and analytics modules aligned with Uplifty's internal data platform.</li>
            <li>Applied statistical analysis and A/B testing methodologies to measure feature impact, drafting technical documentation for reproducibility and seamless collaboration with product, ML, and engineering teams.</li>
        </ul>
        `,
    },
    {
        title: 'Data Analyst Intern',
        company: 'Afame Technologies',
        duration: 'Jan 2024 – Mar 2024',
        location: 'Bangalore,Karnataka, India',
        description: `
        <ul>
            <li>Worked with a consulting analytics team to design data-driven dashboards, KPIs, and insights reports for client business operations using Excel, SQL, Power BI, and Python.</li>
            <li>Conducted exploratory data analysis, anomaly detection, and trend modeling to support decision-making for marketing, operations, and finance use cases.</li>
            <li>Automated data cleaning and validation workflows, improving efficiency and reducing manual processing effort for recurring client deliverables.</li>
            <li>Collaborated with senior consultants to translate ambiguous business requirements into analytical problems, producing insights presentations consumed by clients.</li>
        </ul>
        `,
    },
    {
        title: 'Software Development Engineer',
        company: 'V3Techserv',
        duration: 'Jun 2022 – Jul 2023',
        location: 'Chennai,Tamilnadu, India',
        description: `
        <ul>
            <li>Engineered backend services using FastAPI, SQL, and Python for consulting and education-sector applications, contributing to authentication modules, REST APIs, and database design.</li>
            <li>Developed machine learning solutions for fraud detection, pricing automation, and predictive analytics, applying statistical modeling, regression, clustering, and anomaly detection.</li>
            <li>Built reusable object-oriented data pipelines with Python to support analytics workflows, implementing ETL logic, preprocessing steps, and evaluation modules.</li>
            <li>Collaborated with cross-functional teams to gather requirements, deploy production features, and deliver technical documentation for clients across consulting and IT-enabled service verticals.</li>
        </ul>
        `,
    },
    {
        title: 'Software Developer',
        company: 'Freelance - Upwork',
        duration: 'Nov 2021 – May 2022',
        location: 'Coimbatore,Tamilnadu, India',
        description: `
        <ul>
            <li>Designed and developed full-stack applications from scratch for local businesses, including a jewellery store and a marriage hall booking system.</li>
            <li>Built complete systems covering frontend (HTML/CSS/JS), backend (Python/Node), database design (MySQL), analytics tracking, and admin panels for day-to-day operations.</li>
            <li>Worked in a team of five freelancers, coordinating development tasks, integrating APIs, building dashboards, and managing version control using Git.</li>
            <li>Delivered scalable, user-friendly systems that improved business workflows, inventory management, and customer interaction processes.</li>
        </ul>
        `,
    },
];