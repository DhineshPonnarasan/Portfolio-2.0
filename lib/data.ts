import { IProject, IPublication, IEducation, IContribution } from '@/types';

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
            name: 'C/C++',
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
            name: 'Vercel',
            icon: '/logo/vercel.svg',
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
            name: 'Vercel Deployment',
            icon: '/logo/vercel-deployment.svg',
        },
        {
            name: 'Supabase Backend',
            icon: '/logo/supabase-backend.svg',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        "title": "Large-Scale Social Media Sentiment Intelligence Platform",
        "slug": "social-media-sentiment",
        "techStack": [
            "Spark",
            "Kafka",
            "Transformers",
            "BERT",
            "NLP",
            "Python"
        ],
        "thumbnail": "/projects/social-media-sentiment/ui.svg",
        "longThumbnail": "/projects/social-media-sentiment/ui.svg",
        "images": [
            "/projects/social-media-sentiment/ui.svg",
            "/projects/social-media-sentiment/architecture.svg",
            "/projects/social-media-sentiment/visualization-1.svg",
            "/projects/social-media-sentiment/visualization-2.svg"
        ],
        "year": 2025,
        "description": "A distributed real-time NLP system engineered to process millions of streaming posts using Spark, Kafka, and transformer-based deep learning. This platform addresses the challenge of analyzing noisy, multilingual social media text at scale by leveraging a microservices architecture. It ingests high-velocity data streams via Kafka, processes them using Spark Streaming for low-latency throughput, and applies fine-tuned BERT models for nuanced sentiment and topic classification. The system provides real-time actionable insights through live dashboards, enabling businesses to monitor brand health and emerging trends instantly.",
        "keyFeatures": [
            "Spark + Kafka real-time streaming NLP pipeline.",
            "Multilingual BERT sentiment + topic classification.",
            "Microservice inference with autoscaling.",
            "Real-time dashboards + alerts."
        ],
        "technicalHighlights": [
            "Optimized Spark Streaming for sub-second latency.",
            "Implemented custom BERT model fine-tuning for noisy social data.",
            "Deployed scalable inference using Docker and Kubernetes."
        ],
        "whatIBuilt": [
            "Designed and implemented the end-to-end data pipeline.",
            "Trained and deployed NLP models for sentiment analysis.",
            "Built real-time monitoring and alerting systems."
        ],
        "skills": [
            "Distributed Computing (Apache Spark, Kafka)",
            "NLP & Transformers (BERT, tokenization, multilingual NLP)",
            "Real-time Systems Engineering",
            "Microservices Architecture (batching, caching, autoscaling)",
            "Data Engineering & Streaming Pipelines",
            "Dashboarding & BI (Power BI)"
        ],
        "gallery": [
            {
                "src": "/projects/social-media-sentiment/ui.svg",
                "alt": "Large-Scale Social Media Sentiment Intelligence Platform - UI Dashboard"
            },
            {
                "src": "/projects/social-media-sentiment/architecture.svg",
                "alt": "Large-Scale Social Media Sentiment Intelligence Platform - System Architecture"
            },
            {
                "src": "/projects/social-media-sentiment/visualization-1.svg",
                "alt": "Large-Scale Social Media Sentiment Intelligence Platform - Visualization"
            },
            {
                "src": "/projects/social-media-sentiment/visualization-2.svg",
                "alt": "Large-Scale Social Media Sentiment Intelligence Platform - Metrics"
            }
        ]
    },
    {
        "title": "Customer Churn Decision Intelligence System",
        "slug": "customer-churn-intelligence",
        "techStack": [
            "XGBoost",
            "CatBoost",
            "MLflow",
            "Airflow",
            "FastAPI"
        ],
        "thumbnail": "/projects/customer-churn-intelligence/ui.svg",
        "longThumbnail": "/projects/customer-churn-intelligence/ui.svg",
        "images": [
            "/projects/customer-churn-intelligence/ui.svg",
            "/projects/customer-churn-intelligence/architecture.svg",
            "/projects/customer-churn-intelligence/visualization-1.svg",
            "/projects/customer-churn-intelligence/visualization-2.svg"
        ],
        "year": 2024,
        "description": "End-to-end ML lifecycle system enabling churn prediction, interpretability, and real-time scoring. This project focuses on reducing customer attrition by identifying high-risk users before they leave. It utilizes an ensemble of gradient boosting models (XGBoost, CatBoost) managed via MLflow for versioning and reproducibility. The pipeline is orchestrated with Airflow for automated retraining and drift detection. A key differentiator is the integration of SHAP values to provide explainable AI insights, allowing non-technical stakeholders to understand the \"why\" behind every churn prediction.",
        "keyFeatures": [
            "MLflow lifecycle management.",
            "Automated Airflow retraining.",
            "SHAP interpretability.",
            "FastAPI live scoring."
        ],
        "technicalHighlights": [
            "Improved model accuracy by 21% using ensemble methods.",
            "Implemented automated model drift detection.",
            "Reduced inference latency to under 50ms."
        ],
        "whatIBuilt": [
            "Developed the entire ML pipeline from data ingestion to deployment.",
            "Implemented model explainability features for stakeholders.",
            "Built the real-time scoring API."
        ],
        "skills": [
            "Machine Learning Lifecycle (MLflow, Airflow)",
            "Gradient-boosting Models (XGBoost, CatBoost)",
            "Explainable AI (SHAP)",
            "Model Deployment (FastAPI, CI/CD)",
            "Production Model Monitoring"
        ],
        "gallery": [
            {
                "src": "/projects/customer-churn-intelligence/ui.svg",
                "alt": "Customer Churn Decision Intelligence System - UI Dashboard"
            },
            {
                "src": "/projects/customer-churn-intelligence/architecture.svg",
                "alt": "Customer Churn Decision Intelligence System - System Architecture"
            },
            {
                "src": "/projects/customer-churn-intelligence/visualization-1.svg",
                "alt": "Customer Churn Decision Intelligence System - Visualization"
            },
            {
                "src": "/projects/customer-churn-intelligence/visualization-2.svg",
                "alt": "Customer Churn Decision Intelligence System - Metrics"
            }
        ]
    },
    {
        "title": "Deep Learning Brain Tumor Classification",
        "slug": "brain-tumor-classification",
        "techStack": [
            "TensorFlow",
            "CNN",
            "Computer Vision"
        ],
        "thumbnail": "/projects/brain-tumor-classification/ui.svg",
        "longThumbnail": "/projects/brain-tumor-classification/ui.svg",
        "images": [
            "/projects/brain-tumor-classification/ui.svg",
            "/projects/brain-tumor-classification/architecture.svg",
            "/projects/brain-tumor-classification/visualization-1.svg",
            "/projects/brain-tumor-classification/visualization-2.svg"
        ],
        "year": 2024,
        "description": "Production-ready tumor detection model designed to assist radiologists with high-precision MRI analysis. The system employs advanced Convolutional Neural Networks (EfficientNet/ResNet) to classify brain tumors with state-of-the-art accuracy. Beyond classification, it integrates Grad-CAM++ to generate visual heatmaps, highlighting the specific regions of the MRI scan that influenced the model's decision. This explainability layer is crucial for clinical trust and adoption. The solution is containerized for easy deployment in hospital IT environments.",
        "keyFeatures": [
            "EfficientNet/ResNet MRI models.",
            "Grad-CAM++ overlays.",
            "Containerized inference API."
        ],
        "technicalHighlights": [
            "Achieved 98% accuracy on MRI dataset.",
            "Implemented advanced data augmentation techniques.",
            "Integrated explainable AI to assist radiologists."
        ],
        "whatIBuilt": [
            "Trained and optimized deep learning models.",
            "Developed the explainability module.",
            "Deployed the model as a containerized service."
        ],
        "skills": [
            "Deep Learning (CNNs, ResNet, EfficientNet)",
            "Medical Imaging (MRI preprocessing, augmentation)",
            "Explainable AI (Grad-CAM++)",
            "MLOps / Containerized Inference APIs",
            "Model Optimization & Evaluation"
        ],
        "gallery": [
            {
                "src": "/projects/brain-tumor-classification/ui.svg",
                "alt": "Deep Learning Brain Tumor Classification - UI Dashboard"
            },
            {
                "src": "/projects/brain-tumor-classification/architecture.svg",
                "alt": "Deep Learning Brain Tumor Classification - System Architecture"
            },
            {
                "src": "/projects/brain-tumor-classification/visualization-1.svg",
                "alt": "Deep Learning Brain Tumor Classification - Visualization"
            },
            {
                "src": "/projects/brain-tumor-classification/visualization-2.svg",
                "alt": "Deep Learning Brain Tumor Classification - Metrics"
            }
        ]
    },
    {
        "title": "Financial Fraud Detection Engine",
        "slug": "financial-fraud-detection",
        "techStack": [
            "Autoencoder",
            "Kafka",
            "Python",
            "Anomaly Detection"
        ],
        "thumbnail": "/projects/financial-fraud-detection/ui.svg",
        "longThumbnail": "/projects/financial-fraud-detection/ui.svg",
        "images": [
            "/projects/financial-fraud-detection/ui.svg",
            "/projects/financial-fraud-detection/architecture.svg",
            "/projects/financial-fraud-detection/visualization-1.svg",
            "/projects/financial-fraud-detection/visualization-2.svg"
        ],
        "year": 2024,
        "description": "Hybrid fraud detection engine combining deep learning and anomaly models to combat sophisticated financial crime. This system addresses the severe class imbalance in fraud datasets by using Autoencoders to learn normal transaction patterns and flag deviations. It operates in real-time, scoring millions of transactions via a Kafka event backbone. By augmenting traditional rules-based systems with unsupervised deep learning, the engine significantly reduces false positives while catching novel, previously unseen fraud patterns that static rules miss.",
        "keyFeatures": [
            "Autoencoder + Isolation Forest hybrid.",
            "Real-time Kafka event scoring.",
            "Behavior-based feature mapping."
        ],
        "technicalHighlights": [
            "Reduced false positives by 27%.",
            "Implemented real-time anomaly scoring.",
            "Designed a scalable event processing architecture."
        ],
        "whatIBuilt": [
            "Developed the hybrid anomaly detection model.",
            "Built the real-time scoring pipeline.",
            "Implemented feature engineering for behavioral patterns."
        ],
        "skills": [
            "Anomaly Detection (Autoencoders, Isolation Forest)",
            "Behavioral Feature Engineering",
            "Real-time Event Processing (Kafka)",
            "Statistical Modeling",
            "Fraud Risk Scoring & Alerting Systems"
        ],
        "gallery": [
            {
                "src": "/projects/financial-fraud-detection/ui.svg",
                "alt": "Financial Fraud Detection Engine - UI Dashboard"
            },
            {
                "src": "/projects/financial-fraud-detection/architecture.svg",
                "alt": "Financial Fraud Detection Engine - System Architecture"
            },
            {
                "src": "/projects/financial-fraud-detection/visualization-1.svg",
                "alt": "Financial Fraud Detection Engine - Visualization"
            },
            {
                "src": "/projects/financial-fraud-detection/visualization-2.svg",
                "alt": "Financial Fraud Detection Engine - Metrics"
            }
        ]
    },
    {
        "title": "YOLOv8 Real-Time Vision Inference Engine",
        "slug": "yolov8-inference-engine",
        "techStack": [
            "YOLOv8",
            "PyTorch",
            "TensorRT",
            "OpenCV"
        ],
        "thumbnail": "/projects/yolov8-inference-engine/ui.svg",
        "longThumbnail": "/projects/yolov8-inference-engine/ui.svg",
        "images": [
            "/projects/yolov8-inference-engine/ui.svg",
            "/projects/yolov8-inference-engine/architecture.svg",
            "/projects/yolov8-inference-engine/visualization-1.svg",
            "/projects/yolov8-inference-engine/visualization-2.svg"
        ],
        "year": 2024,
        "description": "High-throughput object detection system optimized for edge inference and real-time video analytics. Built on the state-of-the-art YOLOv8 architecture, this engine is engineered for speed and efficiency. It leverages TensorRT optimization to accelerate inference on NVIDIA hardware, achieving high frame rates suitable for live video streams. The system integrates with WebRTC for low-latency video transmission, making it ideal for applications like security monitoring, industrial safety, and autonomous navigation where milliseconds matter.",
        "keyFeatures": [
            "YOLOv8 training with augmentation.",
            "Hardware-accelerated inference.",
            "WebRTC + FastAPI streaming."
        ],
        "technicalHighlights": [
            "Optimized inference speed to 30-60 FPS.",
            "Implemented TensorRT acceleration for edge devices.",
            "Built a low-latency video streaming pipeline."
        ],
        "whatIBuilt": [
            "Trained and optimized object detection models.",
            "Implemented hardware acceleration.",
            "Developed the real-time video inference system."
        ],
        "skills": [
            "Computer Vision (YOLOv8, object detection)",
            "Edge Inference Optimization (TensorRT)",
            "High-throughput Streaming (WebRTC)",
            "PyTorch Model Deployment",
            "Latency Optimization"
        ],
        "gallery": [
            {
                "src": "/projects/yolov8-inference-engine/ui.svg",
                "alt": "YOLOv8 Real-Time Vision Inference Engine - UI Dashboard"
            },
            {
                "src": "/projects/yolov8-inference-engine/architecture.svg",
                "alt": "YOLOv8 Real-Time Vision Inference Engine - System Architecture"
            },
            {
                "src": "/projects/yolov8-inference-engine/visualization-1.svg",
                "alt": "YOLOv8 Real-Time Vision Inference Engine - Visualization"
            },
            {
                "src": "/projects/yolov8-inference-engine/visualization-2.svg",
                "alt": "YOLOv8 Real-Time Vision Inference Engine - Metrics"
            }
        ]
    },
    {
        "title": "Hybrid Recommendation Engine",
        "slug": "hybrid-recommendation-engine",
        "techStack": [
            "FAISS",
            "NCF",
            "Matrix Factorization",
            "Python"
        ],
        "thumbnail": "/projects/hybrid-recommendation-engine/ui.svg",
        "longThumbnail": "/projects/hybrid-recommendation-engine/ui.svg",
        "images": [
            "/projects/hybrid-recommendation-engine/ui.svg",
            "/projects/hybrid-recommendation-engine/architecture.svg",
            "/projects/hybrid-recommendation-engine/visualization-1.svg",
            "/projects/hybrid-recommendation-engine/visualization-2.svg"
        ],
        "year": 2023,
        "description": "Enterprise-grade recommendation engine featuring a multi-stage ranking architecture for personalized user experiences. The system solves the \"cold start\" problem and improves long-tail recommendations by combining Matrix Factorization with Neural Collaborative Filtering (NCF). It utilizes FAISS for lightning-fast vector similarity search, enabling the retrieval of relevant items from a catalog of millions in milliseconds. The architecture supports real-time updates, ensuring that user interactions are immediately reflected in future recommendations.",
        "keyFeatures": [
            "Matrix factorization embeddings.",
            "Neural collaborative filtering.",
            "FAISS vector search."
        ],
        "technicalHighlights": [
            "Improved recommendation relevance by 35%.",
            "Implemented sub-10ms vector search.",
            "Designed a scalable recommendation pipeline."
        ],
        "whatIBuilt": [
            "Developed the hybrid recommendation algorithms.",
            "Implemented the vector search infrastructure.",
            "Optimized the ranking system for performance."
        ],
        "skills": [
            "Recommender Systems (NCF, Matrix Factorization)",
            "Vector Similarity Search (FAISS)",
            "Ranking Algorithms",
            "Embedding Engineering",
            "ML API Serving"
        ],
        "gallery": [
            {
                "src": "/projects/hybrid-recommendation-engine/ui.svg",
                "alt": "Hybrid Recommendation Engine - UI Dashboard"
            },
            {
                "src": "/projects/hybrid-recommendation-engine/architecture.svg",
                "alt": "Hybrid Recommendation Engine - System Architecture"
            },
            {
                "src": "/projects/hybrid-recommendation-engine/visualization-1.svg",
                "alt": "Hybrid Recommendation Engine - Visualization"
            },
            {
                "src": "/projects/hybrid-recommendation-engine/visualization-2.svg",
                "alt": "Hybrid Recommendation Engine - Metrics"
            }
        ]
    },
    {
        "title": "Big Data Demand Forecasting Pipeline",
        "slug": "demand-forecasting-pipeline",
        "techStack": [
            "PySpark",
            "Prophet",
            "Big Data",
            "XGBoost"
        ],
        "thumbnail": "/projects/demand-forecasting-pipeline/ui.svg",
        "longThumbnail": "/projects/demand-forecasting-pipeline/ui.svg",
        "images": [
            "/projects/demand-forecasting-pipeline/ui.svg",
            "/projects/demand-forecasting-pipeline/architecture.svg",
            "/projects/demand-forecasting-pipeline/visualization-1.svg",
            "/projects/demand-forecasting-pipeline/visualization-2.svg"
        ],
        "year": 2023,
        "description": "Distributed demand forecasting framework engineered for retail analytics at scale. This pipeline processes massive datasets using PySpark to handle data ingestion and feature engineering across distributed clusters. It implements a hybrid forecasting approach, combining the trend and seasonality decomposition of Prophet with the gradient boosting power of XGBoost. The system automatically detects anomalies in sales data and generates accurate demand predictions at the SKU level, enabling retailers to optimize inventory levels and reduce stockouts.",
        "keyFeatures": [
            "PySpark ingestion & feature engineering.",
            "Prophet + XGBoost hybrid forecasting.",
            "Automated reporting dashboards."
        ],
        "technicalHighlights": [
            "Processed multi-million row datasets efficiently.",
            "Implemented hierarchical forecasting models.",
            "Automated anomaly detection in sales data."
        ],
        "whatIBuilt": [
            "Built the distributed data processing pipeline.",
            "Developed and tuned forecasting models.",
            "Created automated reporting dashboards."
        ],
        "skills": [
            "PySpark ETL & Data Engineering",
            "Time-Series Forecasting (Prophet, DeepAR, XGBoost)",
            "Big Data Processing & Optimization",
            "Automated Anomaly Detection",
            "Dashboarding for Forecast Analytics"
        ],
        "gallery": [
            {
                "src": "/projects/demand-forecasting-pipeline/ui.svg",
                "alt": "Big Data Demand Forecasting Pipeline - UI Dashboard"
            },
            {
                "src": "/projects/demand-forecasting-pipeline/architecture.svg",
                "alt": "Big Data Demand Forecasting Pipeline - System Architecture"
            },
            {
                "src": "/projects/demand-forecasting-pipeline/visualization-1.svg",
                "alt": "Big Data Demand Forecasting Pipeline - Visualization"
            },
            {
                "src": "/projects/demand-forecasting-pipeline/visualization-2.svg",
                "alt": "Big Data Demand Forecasting Pipeline - Metrics"
            }
        ]
    },
    {
        "title": "Intelligent Resume Parser & Skill Extraction",
        "slug": "resume-parser",
        "techStack": [
            "BERT",
            "spaCy",
            "NLP"
        ],
        "thumbnail": "/projects/resume-parser/ui.svg",
        "longThumbnail": "/projects/resume-parser/ui.svg",
        "images": [
            "/projects/resume-parser/ui.svg",
            "/projects/resume-parser/architecture.svg",
            "/projects/resume-parser/visualization-1.svg",
            "/projects/resume-parser/visualization-2.svg"
        ],
        "year": 2023,
        "description": "Automated resume understanding and candidate scoring system driven by advanced NLP. This tool moves beyond simple keyword matching by using Named Entity Recognition (NER) to extract structured data (skills, experience, education) from unstructured resume text. Powered by fine-tuned BERT models and spaCy, it understands context and variations in job titles and skill descriptions. The system includes a ranking engine that scores candidates against job descriptions, streamlining the recruitment process and surfacing the best talent.",
        "keyFeatures": [
            "BERT + spaCy NER pipeline.",
            "92% extraction accuracy.",
            "Ranking engine for scoring."
        ],
        "technicalHighlights": [
            "Fine-tuned BERT for entity extraction.",
            "Implemented a custom ranking algorithm.",
            "Achieved high accuracy on diverse resume formats."
        ],
        "whatIBuilt": [
            "Developed the NLP pipeline for entity extraction.",
            "Built the candidate scoring engine.",
            "Optimized the system for accuracy and performance."
        ],
        "skills": [
            "NLP (BERT, spaCy, NER)",
            "Information Extraction & Classification",
            "Semantic Similarity Modeling",
            "Text Preprocessing & Tokenization",
            "Pipeline Deployment"
        ],
        "gallery": [
            {
                "src": "/projects/resume-parser/ui.svg",
                "alt": "Intelligent Resume Parser & Skill Extraction - UI Dashboard"
            },
            {
                "src": "/projects/resume-parser/architecture.svg",
                "alt": "Intelligent Resume Parser & Skill Extraction - System Architecture"
            },
            {
                "src": "/projects/resume-parser/visualization-1.svg",
                "alt": "Intelligent Resume Parser & Skill Extraction - Visualization"
            },
            {
                "src": "/projects/resume-parser/visualization-2.svg",
                "alt": "Intelligent Resume Parser & Skill Extraction - Metrics"
            }
        ]
    },
    {
        "title": "Cloud-Native Data Warehouse & ETL System",
        "slug": "cloud-data-warehouse",
        "techStack": [
            "Snowflake",
            "BigQuery",
            "dbt",
            "Airflow"
        ],
        "thumbnail": "/projects/cloud-data-warehouse/ui.svg",
        "longThumbnail": "/projects/cloud-data-warehouse/ui.svg",
        "images": [
            "/projects/cloud-data-warehouse/ui.svg",
            "/projects/cloud-data-warehouse/architecture.svg",
            "/projects/cloud-data-warehouse/visualization-1.svg",
            "/projects/cloud-data-warehouse/visualization-2.svg"
        ],
        "year": 2023,
        "description": "Modern cloud data warehouse and analytics engineering ecosystem designed for scalability and performance. This project migrated legacy data silos into a unified Snowflake data warehouse, utilizing dbt (data build tool) for modular, version-controlled transformations. Airflow orchestrates complex ETL dependencies, ensuring timely data delivery. The architecture follows best practices like Kimball dimensional modeling, enabling self-service analytics and reducing query times significantly for business intelligence teams.",
        "keyFeatures": [
            "Airflow + dbt pipelines.",
            "Fact/dim modeling.",
            "Optimized warehouse performance."
        ],
        "technicalHighlights": [
            "Reduced query times by 60%.",
            "Implemented rigorous data quality tests.",
            "Designed scalable data models for analytics."
        ],
        "whatIBuilt": [
            "Designed and implemented the data warehouse schema.",
            "Built ETL pipelines using Airflow and dbt.",
            "Optimized query performance and data quality."
        ],
        "skills": [
            "Cloud Warehousing (Snowflake / BigQuery)",
            "Data Modeling (Fact/Dimensional schema)",
            "dbt Transformations",
            "Airflow Orchestration",
            "Analytics Engineering"
        ],
        "gallery": [
            {
                "src": "/projects/cloud-data-warehouse/ui.svg",
                "alt": "Cloud-Native Data Warehouse & ETL System - UI Dashboard"
            },
            {
                "src": "/projects/cloud-data-warehouse/architecture.svg",
                "alt": "Cloud-Native Data Warehouse & ETL System - System Architecture"
            },
            {
                "src": "/projects/cloud-data-warehouse/visualization-1.svg",
                "alt": "Cloud-Native Data Warehouse & ETL System - Visualization"
            },
            {
                "src": "/projects/cloud-data-warehouse/visualization-2.svg",
                "alt": "Cloud-Native Data Warehouse & ETL System - Metrics"
            }
        ]
    },
    {
        "title": "Blood Group Classification Using Quantum Deep Learning",
        "slug": "quantum-blood-group",
        "techStack": [
            "Quantum ML",
            "Qiskit",
            "Pennylane",
            "CNN",
            "Deep Learning"
        ],
        "thumbnail": "/projects/quantum-blood-group/ui.svg",
        "longThumbnail": "/projects/quantum-blood-group/ui.svg",
        "images": [
            "/projects/quantum-blood-group/ui.svg",
            "/projects/quantum-blood-group/architecture.svg",
            "/projects/quantum-blood-group/visualization-1.svg",
            "/projects/quantum-blood-group/visualization-2.svg"
        ],
        "year": 2023,
        "description": "Cutting-edge research project exploring the intersection of Quantum Computing and Deep Learning for medical diagnostics. This hybrid system integrates Variational Quantum Circuits (VQC) with classical Convolutional Neural Networks (CNN) to classify blood group images. By leveraging quantum entanglement and superposition, the model aims to capture complex patterns that classical networks might miss. Implemented using Qiskit and Pennylane, this project demonstrates the potential of Quantum Machine Learning (QML) to enhance classification accuracy in healthcare applications.",
        "keyFeatures": [
            "VQC + CNN architecture.",
            "Pennylane/Qiskit quantum layers.",
            "Improved accuracy over classical CNNs."
        ],
        "technicalHighlights": [
            "Integrated quantum circuits with classical neural networks.",
            "Simulated quantum noise effects.",
            "Demonstrated quantum advantage in classification tasks."
        ],
        "whatIBuilt": [
            "Designed the hybrid quantum-classical architecture.",
            "Implemented quantum layers using Qiskit and Pennylane.",
            "Conducted experiments to validate performance improvements."
        ],
        "skills": [
            "Quantum Machine Learning (Qiskit, Pennylane)",
            "Hybrid Quantum-Classical Models",
            "CNN Feature Extraction",
            "Variational Quantum Circuits (VQC)",
            "Experimental Model Benchmarking"
        ],
        "gallery": [
            {
                "src": "/projects/quantum-blood-group/ui.svg",
                "alt": "Blood Group Classification Using Quantum Deep Learning - UI Dashboard"
            },
            {
                "src": "/projects/quantum-blood-group/architecture.svg",
                "alt": "Blood Group Classification Using Quantum Deep Learning - System Architecture"
            },
            {
                "src": "/projects/quantum-blood-group/visualization-1.svg",
                "alt": "Blood Group Classification Using Quantum Deep Learning - Visualization"
            },
            {
                "src": "/projects/quantum-blood-group/visualization-2.svg",
                "alt": "Blood Group Classification Using Quantum Deep Learning - Metrics"
            }
        ]
    }
];

export const MY_CONTRIBUTIONS: IContribution[] = [
    {
        title: 'NumPy — Open Source Contributor',
        slug: 'numpy',
        date: '2025 (Active Contribution)',
        description: 'Documentation and numerical edge-case enhancements.',
        points: [
            'Updated mathematical function documentation for clarity.',
            'Identified numerical issues in array operations.',
            'Improved example patterns for broadcasting and vectorization.',
        ],
        link: 'https://github.com/DhineshPonnarasan/numpy',
        techStack: ['Python', 'C', 'NumPy API', 'Sphinx'],
        stats: {
            pullRequests: 5,
            commits: 12,
            linesOfCode: '500+',
        },
    },
    {
        title: 'Keras — Open Source Contributor',
        slug: 'keras',
        date: '2025 (Active Contribution)',
        description: 'Improvements to deep learning example notebooks.',
        points: [
            'Updated CNN/LSTM/Transformer example workflows.',
            'Fixed data preprocessing inconsistencies.',
            'Added clarifications to layer and callback documentation.',
        ],
        link: 'https://github.com/DhineshPonnarasan/keras',
        techStack: ['Python', 'TensorFlow', 'Keras', 'Jupyter'],
        stats: {
            pullRequests: 8,
            commits: 15,
            linesOfCode: '1.2k+',
        },
    },
    {
        title: 'PyTorch — Open Source Contributor',
        slug: 'pytorch',
        date: '2025 (Active Contribution)',
        description: 'Contributed bug fixes and doc improvements.',
        points: [
            'Assisted resolving issues in model deployment and autograd examples.',
            'Improved documentation for torch.nn and torchvision utilities.',
            'Participated in community validation of PRs.',
        ],
        link: 'https://github.com/DhineshPonnarasan/pytorch',
        techStack: ['Python', 'C++', 'PyTorch', 'CUDA'],
        stats: {
            pullRequests: 6,
            commits: 10,
            linesOfCode: '800+',
        },
    },
    {
        title: 'TensorFlow — Open Source Contributor',
        slug: 'tensorflow',
        date: '2025 (Active Contribution)',
        description: 'Fixes and enhancements across TF examples and utilities.',
        points: [
            'Improved dataset loading examples and preprocessing utilities.',
            'Fixed issues related to training script reproducibility.',
            'Updated documentation for clearer API explanations.',
        ],
        link: 'https://github.com/DhineshPonnarasan/tensorflow',
        techStack: ['Python', 'C++', 'Bazel', 'TensorFlow'],
        stats: {
            pullRequests: 4,
            commits: 9,
            linesOfCode: '600+',
        },
    },
    {
        title: 'Amazon SageMaker — Open Source Contributor',
        slug: 'amazon-sagemaker',
        date: '2025 (Active Contribution)',
        description: 'Contributions to SageMaker example pipelines and documentation.',
        points: [
            'Improved Jupyter notebook templates and example training pipelines.',
            'Fixed configuration issues in distributed training samples.',
            'Enhanced documentation readability for ML beginners.',
        ],
        link: 'https://github.com/DhineshPonnarasan/amazon-sagemaker',
        techStack: ['Python', 'AWS', 'SageMaker SDK', 'Docker'],
        stats: {
            pullRequests: 7,
            commits: 14,
            linesOfCode: '1.5k+',
        },
    },
    {
        title: 'Social Winter of Code (SWoC – 2026)',
        slug: 'swoc-2026',
        role: 'Student Developer – AI/ML Contributor',
        date: 'Jan 2026 – Mar 2026',
        description: 'Built a computer vision project and contributed fixes to the community repository.',
        points: [
            'Developed a YOLOv8-based real-time traffic sign detection and classification system.',
            'Built a FastAPI backend and OpenCV interface for live video inference.',
            'Improved dataset preprocessing, augmentation, and training workflows.',
            'Submitted fixes and documentation improvements to maintainers for better reproducibility.',
        ],
        techStack: ['Python', 'YOLOv8', 'FastAPI', 'OpenCV'],
        stats: {
            pullRequests: 12,
            commits: 45,
            linesOfCode: '3k+',
        },
    },
    {
        title: 'Google Season of Docs (GSoD – 2022)',
        slug: 'gsod-2022',
        role: 'Student Developer – Wechaty',
        date: 'Feb 2022 – May 2022',
        description: 'Contributed to Wechaty documentation and landing page redesign.',
        points: [
            'Redesigned and implemented the Wechaty landing page to improve clarity and onboarding experience.',
            'Contributed UI/UX and frontend improvements using HTML, CSS, JS, and Markdown.',
            'Improved developer documentation structure for better navigation and API discoverability.',
            'Enhanced performance and accessibility for high-traffic documentation pages.',
        ],
        link: 'https://wechaty.js.org/',
        techStack: ['JavaScript', 'Docusaurus', 'React', 'Markdown'],
        stats: {
            pullRequests: 25,
            commits: 60,
            linesOfCode: '5k+',
        },
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