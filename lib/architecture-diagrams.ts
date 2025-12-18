export const ARCHITECTURE_DIAGRAMS: Record<number, string> = {
  1: `----------------------------------
| 1. DATA SOURCES                  |
| Kaggle Telco Churn, IBM CRM      |
| exports, application usage logs, |
| and support ticket transcripts   |
| form the core dataset. These     |
| sources capture behavioral and   |
| transactional signals tied to    |
| customer lifecycle stages. All   |
| inputs undergo schema validation |
| and anomaly screening to ensure  |
| consistency.                     |
------------------------------------
           |
           v
------------------------------------
| 2. INGESTION & PREPROCESSING     |
| Batch loaders merge CRM data     |
| with historical usage metrics,   |
| while event streams provide live |
| churn-indicating signals.        |
| Preprocessing handles null       |
| through demographic-aware        |
| imputation, reconstructs         |
| interaction sequences, and       |
| normalizes heterogeneous         |
| attributes to ML-ready formats.  |
------------------------------------
           |
           v
------------------------------------
| 3. FEATURE ENGINEERING           |
| Tenure indicators, RFM profiles, |
| contract-based risk markers,     |
| sentiment from support messages, |
| and rolling engagement windows   |
| are engineered. SHAP analysis    |
| informs feature selection by     |
| measuring predictive             |
| contribution. Features are       |
| versioned and stored for         |
| consistent training/inference    |
| usage.                           |
------------------------------------
           |
           v
------------------------------------
| 4. MODEL TRAINING (XGBoost +     |
| SHAP Integration)                |
| Gradient-boosted trees are       |
| trained using cross-validation   |
| to capture nonlinear churn       |
| behavior. SHAP provides          |
| interpretable reasoning for      |
| model predictions, spotlighting  |
| the strongest churn drivers.     |
| Regularization and hyperparameter|
| tuning ensure stable             |
| generalization across cohorts.   |
------------------------------------
           |
           v
------------------------------------
| 5. DEPLOYMENT & INFERENCE        |
| SERVICE                          |
| A FastAPI model server exposes   |
| real-time prediction endpoints   |
| with low-latency scoring         |
| optimized through caching and    |
| lightweight containers. The      |
| service supports batch scoring   |
| for CRM workflows and integrates |
| with retention dashboards used   |
| by business teams.               |
------------------------------------
           |
           v
------------------------------------
| 6. MONITORING & FEEDBACK LOOP    |
| Data drift monitors track shifts |
| in customer profiles and         |
| engagement. Retraining pipelines |
| trigger when model decay is      |
| detected. Business teams feed    |
| back validated churn cases,      |
| allowing continuous learning and |
| improved targeting strategies    |
| over time.                       |
------------------------------------`,
  2: `--------------------------------------
| 1. DATA SOURCES                      |
| Twitter API (academic tier), Reddit  |
| API, and HuggingFace multilingual    |
| sentiment datasets provide diverse   |
| textual content. These sources       |
| capture real-time reactions and      |
| long-term opinion shifts across      |
| regions. Data is assessed for        |
| linguistic variety and topic         |
| distribution before ingestion.       |
----------------------------------------
                       |
                       v
                   --------------------------------------
                   | 2. INGESTION & PREPROCESSING       |
                   | Streaming pipelines deduplicate    |
                   | posts, enforce rate limits, and    |
                   | align timestamps for temporal      |
                   | analysis. Text cleaning removes    |
                   | noise, while language detection    |
                   | and emoji normalization retain     |
                   | semantic nuance. Token boundaries  |
                   | and user metadata enrich           |
                   | downstream modeling.               |
                   --------------------------------------
                       |
                       v
---------------------------------------
| 3. EMBEDDING & FEATURE EXTRACTION   |
| Transformer models (BERT, RoBERTa)  |
| generate contextual embeddings      |
| enriched with topic clusters and    |
| sentiment lexicon scores. Metadata  |
| features such as user engagement,   |
| location, and hashtag frequency     |
| improve robustness. Representations |
| are batched for efficient high-     |
| throughput processing.              |
---------------------------------------
                       |
                       v
                   -------------------------------------
                   | 4. SENTIMENT MODELING             |
                   | Fine-tuned Transformer            |
                   | classifiers predict polarity and  |
                   | emotion intensity. Cross-         |
                   | validation ensures model          |
                   | resilience across languages and   |
                   | dialects. Ensemble blending       |
                   | (BERT + SVM) stabilizes           |
                   | predictions during trending       |
                   | events with high linguistic       |
                   | variance.                         |
                   -------------------------------------
                       |
                       v
---------------------------------------
| 5. AGGREGATION & DASHBOARDING       |
| Sentiment signals are aggregated    |
| by topics, regions, and time        |
| windows to reveal emerging trends.  |
| Power BI dashboards update in near  |
| real time, enabling brand managers  |
| to react early. Historical trends   |
| support deeper longitudinal         |
| analysis.                           |
---------------------------------------
                       |
                       v
                   -------------------------------------
                   | 6. ALERTING & FEEDBACK LOOP       |
                   | Anomaly detectors highlight       |
                   | sudden sentiment spikes linked    |
                   | to global or local events.        |
                   | Feedback from analysts refines    |
                   | topic models and sentiment        |
                   | lexicons. Performance decay       |
                   | triggers retraining to maintain   |
                   | accuracy.                         |
                   -------------------------------------`,
  3: `------------------------------------------------------------     ------------------------------------------------------------
| 1. DATA SOURCES                                          |     | 2. INGESTION & FRAME PROCESSING                          |
| COCO, OpenImages, and custom CCTV video feeds supply     | --> | Video streams are decoded into frames at target FPS.     |
| diverse visual scenes. Data includes indoor, outdoor,    |     | Frames are resized, normalized, and deduped.             |
| and low-light frames. Annotation quality is manually     |     | Metadata such as timestamps and camera IDs are           |
| validated to ensure objects and bounding boxes are       |     | preserved. Preprocessing ensures consistent luminance    |
| accurately labeled for detection training.               |     | and reduces noise for cleaner detection accuracy.        |
------------------------------------------------------------     ------------------------------------------------------------
                                                                                              |
                                                                                              v
------------------------------------------------------------     -------------------------------------------------------------
| 4. MODEL TRAINING (YOLOv8 Optimization)                  |     | 3. ROI EXTRACTION & AUGMENTATION                          |
| YOLOv8 is trained using multi-scale anchors and          | <-- | Regions of interest (ROIs) are identified and cropped     |
| augmented datasets. Hyperparameter sweeps optimize       |     | for targeted augmentation. Techniques include brightness  |
| performance across object sizes. mAP metrics guide       |     | shifts, blur simulation, occlusions, and motion artifacts |
| improvements. Regularization and fine-tuning ensure      |     | to enhance model robustness across real-world scenes.     |
| stability under extreme lighting or motion conditions.   |     -------------------------------------------------------------                                                     |
------------------------------------------------------------     
                       |
                       v
------------------------------------------------------------     ------------------------------------------------------------
| 5. INFERENCE & TRACKING                                  |     | 6. VISUALIZATION & FEEDBACK LOOP                         |
| The deployed model performs real-time detection on       | --> | Detection outputs stream to dashboards showing bounding  |
| GPU/edge accelerators. Multi-object tracking assigns     |     | boxes and confidence scores. Security teams review       |
| persistent identities across video frames. System        |     | false positives/negatives. Continuous learning adjusts   |
| supports alert generation for restricted or unusual      |     | thresholds and retrains models using new video data.     |
| activity zones.                                          |     |----------------------------------------------------------|                                                          |
------------------------------------------------------------`,    
  4: `----------------------------------
| 1. DATA SOURCES                  |
| Kaggle Credit Card Fraud,        |
| open banking transaction logs,   |
| real-time payment streams, and   |
| SWIFT-like synthetic generators  |
| provide high-volume financial    |
| signals. Data is labeled for     |
| fraud patterns and inspected for |
| temporal irregularities common   |
| in online payment flows.         |
------------------------------------
          |
          v
        -----------------------------------
        | 2. INGESTION & PREPROCESSING    |
        | Streaming pipelines validate    |
        | transaction schemas, dedupe     |
        | repeated entries, and enforce   |
        | chronological ordering.         |
        | Numerical fields are normalized |
        | and geographic metadata is      |
        | enriched.                       |
        -----------------------------------
              |
              v
            ------------------------------------
            | 3. FEATURE ENGINEERING           |
            | Time-based movement windows,     |
            | device fingerprints, merchant    |
            | embeddings, and account relation |
            | graphs are constructed.          |
            | Behavioral transitions are       |
            | encoded.                         |
            ------------------------------------
                      |
                      v
                    ----------------------------------
                    | 4. MODEL TRAINING              |
                    | (Autoencoder + Isolation       |
                    | Forest) Autoencoders learn     |
                    | normal patterns. Isolation     |
                    | Forest captures rare behaviors.|
                    | Tuning improves detection.     |
                    ----------------------------------
                            |
                            v
                        ---------------------------------
                        | 5. INFERENCE & ALERTING       |
                        | Low-latency scoring engine    |
                        | evaluates transactions. High- |
                        | risk trigger alerts. Batch    |
                        | scoring supports auditing.    |
                        ---------------------------------
                                |
                                v
                            ---------------------------------
                            | 6. INVESTIGATION &            |
                            | FEEDBACK LOOP                 |
                            | Fraud analysts review cases.  |
                            | Confirmed enrich training.    |
                            | Monitoring tracks drift.      |
                            ---------------------------------`,
  5: `                                                              -----------------------------------
                                                                    | 1. DATA SOURCES                 |
                                                                    | COCO, OpenImages, and custom    |
                                                                    | CCTV video feeds supply diverse |
                                                                    | visual scenes. Data includes    |
                                                                    | indoor, outdoor, and low-light  |
                                                                    | frames. Annotation quality is   |
                                                                    | manually validated.             |
                                                                    -----------------------------------
                                                                      |
                                                                      v
                                                    ----------------------------------
                                                    | 2. INGESTION & FRAME           |
                                                    | PROCESSING                     |
                                                    | Video streams are decoded into |
                                                    | frames at target FPS. Frames   |
                                                    | are resized, normalized, and   |
                                                    | deduped. Metadata is preserved.|
                                                    ----------------------------------
                                                      |
                                                      v
                                    ------------------------------------
                                    | 3. ROI EXTRACTION &              |
                                    | AUGMENTATION                     |
                                    | Regions of interest (ROIs) are   |
                                    | identified and cropped for       |
                                    | targeted augmentation. Techniques|
                                    | enhance model robustness.        |
                                    ------------------------------------
                                      |
                                      v
                    -----------------------------------
                    | 4. MODEL TRAINING (YOLOv8       |
                    | Optimization)                   |
                    | YOLOv8 is trained using multi-  |
                    | scale anchors and augmented     |
                    | datasets. Regularization and    |
                    | fine-tuning ensure stability.   |
                    -----------------------------------
                      |
                      v
    -----------------------------------
    | 5. INFERENCE & TRACKING         |
    | The deployed model performs     |
    | real-time detection on GPU/edge |
    | accelerators. Multi-object      |
    | tracking assigns persistent     |
    | identities across frames.       |
    -----------------------------------
      |
      v
-----------------------------------
| 6. VISUALIZATION & FEEDBACK     |
| LOOP                            |
| Detection outputs are streamed  |
| to dashboards with bounding     |
| boxes and confidence scores.    |
| Security teams provide feedback.|
-----------------------------------`,
  6: `------------------------------------
| 1. DATA SOURCES                   |
| User interaction logs, clickstream|
| histories, and product catalog    |
| exports form core inputs.         |
| Additional datasets such as       |
| RetailRocket samples from Kaggle  |
| provide diversity. Data validated |
| for freshness and sparsity.       |
-------------------------------------
        |
        v
      -----------------------------------
      | 2. INGESTION & PREPROCESSING    |
      | User-event tables are deduped,  |
      | sessionized, and time-aligned   |
      | to capture evolving preferences.|
      | Missing attributes imputed.     |
      | Normalization ensures stable    |
      | ranges.                         |
      -----------------------------------
          |
          v
        --------------------------------
        | 3. FEATURE ENGINEERING       |
        | User and item embeddings     |
        | learned using matrix factor. |
        | Behavioral similarity and    |
        | co-occurrence strengthen     |
        | personalization.             |
        --------------------------------
           |
           v
      -----------------------------------
      | 4. MODEL TRAINING (Hybrid MF +  |
      | NCF)                            |
      | Neural Collaborative Filtering  |
      | and MF models trained jointly.  |
      | Cross-validation stabilizes.    |
      | Ranking objectives enhance      |
      | top-N relevance.                |
      -----------------------------------
        |
        v
      -----------------------------------
      | 5. INFERENCE & SERVING          |
      | Real-time recommendation API    |
      | serves ranked lists with low    |
      | latency. FAISS accelerates      |
      | similarity search. Responses    |
      | adapt dynamically.              |
      -----------------------------------
        |
        v
------------------------------------
| 6. MONITORING & FEEDBACK LOOP    |
| User clicks, purchases, dwell    |
| times close learning loop.       |
| Performance metrics track drift. |
| A/B tests compare strategies.    |
| Continuous retraining ensures    |
| evolution with trends.           |
------------------------------------`,
  7: `----------------------------------
| 1. DATA SOURCES                  |
| POS sales records, inventory     |
| logs, weather APIs, and promo    |
| calendars feed forecasting.      |
| Kaggle retail datasets support   |
| benchmarking. Data completeness  |
| and temporal alignment checked.  |
------------------------------------
                |
                |
                v
        -----------------------------------
        | 2. INGESTION & PREPROCESSING    |
        | PySpark pipelines ingest and    |
        | transform rows, resolving       |
        | missing timestamps. Outliers    |
        | smoothed. Distributed feature   |
        | extraction enables efficient    |
        | large-scale preparation.        |
        -----------------------------------
                       |
                       |
                       v
                --------------------------------
                | 3. FEATURE ENGINEERING       |
                | Lagged features, rolling     |
                | windows, seasonal indicators,|
                | and event-based metadata     |
                | engineered. Correlation      |
                | screening prioritizes        |
                | predictors.                  |
                --------------------------------
                              | 
                              |
                              v
                        ---------------------------------
                        | 4. MODEL TRAINING (Prophet +  |
                        | XGBoost Hybrid)               |
                        | Hybrid models capture         |
                        | seasonality (Prophet) and     |
                        | nonlinear interactions        |
                        | (XGBoost).                    |
                        ---------------------------------
                                       |
                                       |
                                       v
                                -----------------------------------
                                | 5. INFERENCE & SERVING          |
                                | Forecasts computed in batch     |
                                | and published to BI dashboards. |
                                | APIs provide near real-time     |
                                | updates.                        |
                                ----------------------------------
                                              |
                                              |
                                              v
                                        -----------------------------------
                                        | 6. MONITORING & FEEDBACK LOOP   |
                                        | Forecast accuracy tracked by    |
                                        | SKU. Drift triggers retraining. |
                                        | Feedback refines features.      |
                                        -----------------------------------`,
  8: `--------------------------                 ---------------------------------------------- 
| 1.DATA SOURCES            |                    | 2.INGEST & PREP Files                     |
|Kaggle resume datasets,    |          -->       |Resumes are parsed (PDF, DOCX, TXT),       |  
|LinkedIn open datas, ATS   |                    |sections detected.                         |  
|Exports.                   |                    |OCR handles scanned docs.                  |
|Synthetic resume generator |                    │Text is normalized, tokenized, and deduped |
|for rare skills.           |                    │Named entity recognition (NER) extracts    |
-----------------------------                    │skills and experience.                     | 
                                                 │Data is validated for format and diversity.│                 
                                                 ----------------------------------------------
                                                                                                    
                                                      /                    
                                                     /
                                                    v
----------------------           ----------------------------------
| 4. MODEL TRAINING  |           | 3. FEATURE ENGINEERING         |
| (Ranking Models)   |           |  Skill embeddings              |
| BERT-based andand  |    <--    |  experience-level features     |
| gradient-boosted   |           |  computed using Sentence-BERT. |
| ranking trained.   |           |  Semantic similarity profiles  |
| Cross-validation   |           |  boost ranking quality.        |
----------------------           ----------------------------------
          |                              
          v                              
-------------------------------------------------------------------------------
| 5. INFERENCE & RANKING PIPELINE                                             |
| Real-time APIs score resumes with low latency against job descriptions.     |
| Ranked outputs adapt dynamically. Batch scoring aids acquisition workflows. |
| Explanations highlight skill-job relevance.                                 |
-------------------------------------------------------------------------------

              |
              v

------------------------------------------------------------------------------- 
| 6. MONITORING & FEEDBACK LOOP                                           |
| Recruiter feedback refines matching. Hiring outcomes enrich retraining. |
| Continuous improvements enhance ranking precision and fairness.         |
-------------------------------------------------------------------------------`,
  9: `------------------------------------
| 1. DATA SOURCES                  |
| CSVs, APIs, OLTP database        |
| exports, and Kaggle warehouse    |
| benchmarks like TPC-DS populate  |
| pipeline. Partner feeds and      |
| internal logs supplement data.   |
| Validation checks ensure schema  |
| consistency and freshness.       |
------------------------------------
           |
           v
------------------------------------
| 2. INGESTION & ORCHESTRATION     |
| (EXTRACT)                        |
| Airflow DAGs schedule ingestion  |
| jobs that clean, dedupe, and     |
| load raw data into staging       |
| layers. Data lineage and         |
| observability ensure reliability.|
| Failure recovery mechanisms      |
| guarantee stable data flow.      |
------------------------------------
           |
           v
------------------------------------
| 3. TRANSFORMATION (TRANSFORM -   |
| dbt Modeling)                    |
| Modular SQL models apply tests,  |
| documentation, and version       |
| control. dbt enables reproducible|
| transformations. Business logic  |
| centralized to reduce debt and   |
| improve interpretability.        |
------------------------------------
           |
           v
------------------------------------
| 4. WAREHOUSE STORAGE & MODELING  |
| (LOAD)                           |
| Processed data lands in          |
| Snowflake/BigQuery with scalable |
| compute. Fact and dimension      |
| tables support BI workloads.     |
| Materialized views accelerate    |
| dashboard queries.               |
------------------------------------
           |
           v
-------------------------------------
| 5. BI ANALYTICS & SELF-SERVICE    |
| (ANALYZE)                         |
| Power BI, Looker, and Superset    |
| dashboards offer visual analytics.|
| Business users explore curated    |
| datasets. Performance tuning      |
| ensures cost-efficient            |
| computation.                      |
-------------------------------------
           |
           v
------------------------------------
| 6. MONITORING & FEEDBACK LOOP    |
| (MONITOR)                        |
| Data quality metrics track       |
| anomalies. Usage analytics       |
| highlight trends. User feedback  |
| refines models. Pipeline         |
| adjustments and schema updates   |
| evolve with business needs.      |
------------------------------------`,
  10: `------------------------------------                ------------------------------------
| 1. DATA SOURCES                 - |               | 2. INGESTION & PREPROCESSING     |
| NIH blood smear datasets, Kaggle  |               | Images undergo normalization,    |
| hematology datasets, and PhysioNet|               | denoising, and resizing.         |
| imaging archives form foundational|               | Classical DICOM pipelines extract|
| inputs. Patient demographics      |      -->      | pixel metadata. Quantum-related  |
| corpus. Synthetic generators      |               | preprocessing enriches features  |
| create underrepresented variations|               | with encoded phase/amplitude.    |  
| All data validated for quality    |               | Patient-wise splitting ensures   |
| and checked for distortions.      |               | no identity leakage.             |
-------------------------------------               ------------------------------------

                                                     /
                                                    /
                                                   v
                              ----------------------------------
                              | 3. HYBRID FEATURE ENGINEERING  |
                              | CNNs extract spatial           |
                              | representations. VQC-based     |
                              | quantum circuits encode        |
                              | high-dimensional correlations. |
                              | Combined features highlight    |
                              | subtle shape and texture cues. |
                              ----------------------------------
                                |
                                v
------------------------------------
| 4. MODEL TRAINING (Hybrid        |
| Classical + Quantum)             |
| Hybrid architectures combine CNN |
| backbones with quantum layers.   |
| Cross-validation strengthens     |
| generalization. Quantum circuit  |
| tuning improves entanglement     |
| patterns.                        |
------------------------------------
                                 |
                                 |
                                 v
                              ------------------------------------
                              | 5. INFERENCE & DEPLOYMENT        |
                              | Hybrid models deployed via       |
                              | FastAPI services with optimized  |
                              | batch scoring. Quantum inference |
                              | paths simulate circuit           |
                              | evaluation. Outputs include      |
                              | predictions and visual cues      |
                              | highlighting influential regions.|
                              ------------------------------------
                               /
                              /
                             v
-------------------------------------
| 6. MONITORING & FEEDBACK LOOP     |
| Prediction drift and imaging      |
| distribution shifts monitored.    |
| Clinician feedback refines        |
| calibration thresholds. Updated   |
| data triggers retraining. Enhanced|
| reliability of medical            |
| predictions over time.            |
-------------------------------------`,
};

export const getArchitectureDiagram = (projectId: number) => ARCHITECTURE_DIAGRAMS[projectId] || null;
