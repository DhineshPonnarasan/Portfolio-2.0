import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    SiPython, SiCplusplus, SiJavascript, SiTypescript, SiMysql, SiR,
    SiTensorflow, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiOpencv, SiHuggingface,
    SiReact, SiNextdotjs, SiNodedotjs, SiFastapi, SiTailwindcss, SiGit, SiDocker,
    SiLinux, SiApachespark, SiApachekafka, SiApachehadoop,
    SiDbt, SiGooglecloud, SiDatabricks, SiSnowflake, SiKubernetes,
    SiVercel, SiSupabase, SiPostgresql, SiMongodb, SiRedis, SiElasticsearch,
    SiSqlite, SiApachecassandra, SiFlask, SiDjango, SiStreamlit, SiGithub,
    SiJira, SiTableau, SiPlotly, SiKaggle, SiJupyter, SiScipy, SiScrapy,
    SiKeras, SiNvidia
} from 'react-icons/si';
import { FaBrain, FaServer, FaCode, FaRobot, FaJava, FaEye, FaLink, FaChartLine, FaAws, FaMicrosoft, FaChartBar } from 'react-icons/fa';
import { TbApi, TbSql } from 'react-icons/tb';

const LOGO_DIR = path.join(process.cwd(), 'public', 'logo');

// Ensure directory exists
if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true });
}

// Map of filename (without extension) to Icon Component
// We prefer existing files, but this script will overwrite/create SVGs for consistency if needed.
// Actually, let's only generate ones that don't exist or if we want to enforce react-icons style.
// User said "Store all skill icons in the '/logo/' directory".
// Let's generate EVERYTHING to ensure "standardized icons".
// Except maybe the ones that are already nice PNGs/SVGs?
// The user prompt implies replacing text with icons.
// I'll generate SVGs for all skills to ensure availability.

const icons: Record<string, React.ComponentType> = {
    'python': SiPython,
    'java': FaJava,
    'cplusplus': SiCplusplus,
    'javascript': SiJavascript,
    'typescript': SiTypescript,
    'sql': TbSql,
    'r': SiR,
    'scikit-learn': SiScikitlearn,
    'xgboost': SiNumpy, // Fallback
    'random-forest': FaBrain,
    'svm': FaBrain,
    'lightgbm': FaBrain,
    'catboost': FaBrain,
    'automl': FaRobot,
    'mlflow': FaChartLine,
    'hyperparameter-tuning': FaCode,
    'model-selection': FaCode,
    'feature-engineering': FaCode,
    'ensemble-methods': FaBrain,
    'langchain': FaLink,
    'llamaindex': FaBrain,
    'rag-architecture': FaBrain,
    'tensorflow': SiTensorflow,
    'pytorch': SiPytorch,
    'keras': SiKeras,
    'cnn': FaBrain,
    'rnn-lstm-gru': FaBrain,
    'gans': FaBrain,
    'transformers': SiHuggingface,
    'bert': SiHuggingface,
    'gpt': FaBrain,
    'resnet': FaBrain,
    'u-net': FaBrain,
    'yolo': FaEye,
    'tensorrt': SiNvidia,
    'huggingface': SiHuggingface,
    'opencv': SiOpencv,
    'pil-pillow': SiPython,
    'imageio': SiPython,
    'albumentations': SiOpencv,
    'mediapipe': SiGooglecloud,
    'yolov8': FaEye,
    'object-detection': FaBrain,
    'image-segmentation': FaBrain,
    'face-recognition': FaBrain,
    'ocr': FaCode,
    'numpy': SiNumpy,
    'pandas': SiPandas,
    'matplotlib': SiPython,
    'seaborn': SiPython,
    'plotly': SiPlotly,
    'kaggle': SiKaggle,
    'jupyter': SiJupyter,
    'google-colab': SiGooglecloud,
    'scipy': SiScipy,
    'statsmodels': SiPython,
    'beautifulsoup': SiPython,
    'scrapy': SiScrapy,
    'power-bi': FaChartBar,
    'tableau': SiTableau,
    'apache-spark': SiApachespark,
    'apache-kafka': SiApachekafka,
    'hadoop': SiApachehadoop,
    'dbt': SiDbt,
    'aws': FaAws,
    'google-cloud': SiGooglecloud,
    'azure': FaMicrosoft,
    'databricks': SiDatabricks,
    'snowflake': SiSnowflake,
    'docker': SiDocker,
    'kubernetes': SiKubernetes,
    'aws-sagemaker': FaAws,
    'vercel': SiVercel,
    'supabase': SiSupabase,
    'postgresql': SiPostgresql,
    'mongodb': SiMongodb,
    'redis': SiRedis,
    'elasticsearch': SiElasticsearch,
    'mysql': SiMysql,
    'sqlite': SiSqlite,
    'cassandra': SiApachecassandra,
    'fastapi': SiFastapi,
    'flask': SiFlask,
    'django': SiDjango,
    'streamlit': SiStreamlit,
    'next-js': SiNextdotjs,
    'react': SiReact,
    'node-js': SiNodedotjs,
    'github': SiGithub,
    'git': SiGit,
    'ci-cd': FaServer,
    'api-development': TbApi,
    'tailwind-css': SiTailwindcss,
    'jira': SiJira,
    'vercel-deployment': SiVercel,
    'supabase-backend': SiSupabase,
};

const iconColors: Record<string, string> = {
    'python': '#3776AB',
    'java': '#007396',
    'cplusplus': '#00599C',
    'javascript': '#F7DF1E',
    'typescript': '#3178C6',
    'sql': '#4479A1',
    'r': '#276DC3',
    'scikit-learn': '#F7931E',
    'xgboost': '#15B2E5',
    'random-forest': '#228B22',
    'svm': '#FF6F61',
    'lightgbm': '#A4A4A4',
    'catboost': '#FFF000',
    'automl': '#4285F4',
    'mlflow': '#0194E2',
    'hyperparameter-tuning': '#FFD700',
    'model-selection': '#FF4500',
    'feature-engineering': '#32CD32',
    'ensemble-methods': '#8A2BE2',
    'langchain': '#1C3C3C',
    'llamaindex': '#FF0000',
    'rag-architecture': '#008080',
    'tensorflow': '#FF6F00',
    'pytorch': '#EE4C2C',
    'keras': '#D00000',
    'cnn': '#FF1493',
    'rnn-lstm-gru': '#9400D3',
    'gans': '#00CED1',
    'transformers': '#FFD700',
    'bert': '#0000FF',
    'gpt': '#74AA9C',
    'resnet': '#FF4500',
    'u-net': '#4682B4',
    'yolo': '#00FF00',
    'tensorrt': '#76B900',
    'huggingface': '#FFD21E',
    'opencv': '#5C3EE8',
    'pil-pillow': '#3776AB',
    'imageio': '#3776AB',
    'albumentations': '#FF0000',
    'mediapipe': '#00A8E1',
    'yolov8': '#00FF00',
    'object-detection': '#FFA500',
    'image-segmentation': '#20B2AA',
    'face-recognition': '#1E90FF',
    'ocr': '#FFFFFF',
    'numpy': '#013243',
    'pandas': '#150458',
    'matplotlib': '#11557C',
    'seaborn': '#3776AB',
    'plotly': '#3F4F75',
    'kaggle': '#20BEFF',
    'jupyter': '#F37626',
    'google-colab': '#F9AB00',
    'scipy': '#8CAAE6',
    'statsmodels': '#3776AB',
    'beautifulsoup': '#3776AB',
    'scrapy': '#60A839',
    'power-bi': '#F2C811',
    'tableau': '#E97627',
    'apache-spark': '#E25A1C',
    'apache-kafka': '#231F20',
    'hadoop': '#66CCFF',
    'dbt': '#FF694B',
    'aws': '#FF9900',
    'google-cloud': '#4285F4',
    'azure': '#007FFF',
    'databricks': '#FF3621',
    'snowflake': '#29B5E8',
    'docker': '#2496ED',
    'kubernetes': '#326CE5',
    'aws-sagemaker': '#FF9900',
    'vercel': '#FFFFFF',
    'supabase': '#3ECF8E',
    'postgresql': '#4169E1',
    'mongodb': '#47A248',
    'redis': '#DC382D',
    'elasticsearch': '#005571',
    'mysql': '#4479A1',
    'sqlite': '#003B57',
    'cassandra': '#1287B1',
    'fastapi': '#009688',
    'flask': '#FFFFFF',
    'django': '#092E20',
    'streamlit': '#FF4B4B',
    'next-js': '#FFFFFF',
    'react': '#61DAFB',
    'node-js': '#339933',
    'github': '#FFFFFF',
    'git': '#F05032',
    'ci-cd': '#4B0082',
    'api-development': '#0000FF',
    'tailwind-css': '#06B6D4',
    'jira': '#0052CC',
    'vercel-deployment': '#FFFFFF',
    'supabase-backend': '#3ECF8E'
};

console.log('Generating SVGs...');

Object.entries(icons).forEach(([filename, Icon]) => {
    try {
        const color = iconColors[filename] || '#FFFFFF'; // Default to white if not found
        // Render icon to static markup
        const svgString = renderToStaticMarkup(React.createElement(Icon, { size: 48, color: color }));
        
        // Ensure xmlns is present (react-icons usually adds it, but just in case)
        // Also we might want to ensure it has width/height or viewBox
        
        const filePath = path.join(LOGO_DIR, `${filename}.svg`);
        fs.writeFileSync(filePath, svgString);
        console.log(`Generated: ${filename}.svg with color ${color}`);
    } catch (error) {
        console.error(`Failed to generate ${filename}:`, error);
    }
});

console.log('Done!');
