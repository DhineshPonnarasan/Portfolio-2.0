import type { IProject } from '@/types';

/**
 * Case-study front-matter for the top two projects. The case-study route
 * reuses the full `ProjectDetail` component, so the only thing we add on
 * top of the regular `IProject` shape is a short executive summary and
 * the slug of the project the case study is "about".
 */
export interface CaseStudy {
    /** Project slug — keys into PROJECTS in lib/data.ts */
    projectSlug: string;
    /** Lead summary, 1–2 sentences, used as the page subtitle. */
    summary: string;
    /** Optional hero metric tile shown above the standard project body. */
    heroMetric?: { value: string; label: string };
    /** Optional callout blocks placed under the standard project body. */
    callouts?: Array<{ title: string; body: string }>;
}

export const CASE_STUDIES: CaseStudy[] = [
    {
        projectSlug: 'customer-churn-intelligence',
        summary:
            'How a gradient-boosted ensemble, MLflow-tracked experiments, and SHAP explainability were wired into a real-time FastAPI scoring service to give retention teams actionable churn signals under 50 ms.',
        heroMetric: { value: '21%', label: 'Lift over baseline model' },
        callouts: [
            {
                title: 'Why explainability mattered',
                body: 'Retention teams only act on signals they trust. SHAP values turned the model from a black box into a daily stand-up talking point.',
            },
            {
                title: 'What broke first',
                body: 'Data drift in the support-ticket sentiment feed triggered a retraining cycle during the second week of prod. We pre-empted the next drift event with a scheduled Airflow check.',
            },
        ],
    },
    {
        projectSlug: 'social-media-sentiment',
        summary:
            'A streaming-first Spark + Kafka pipeline that processes 2.5M+ social posts per hour through a fine-tuned multilingual BERT, surfacing viral trends and brand sentiment shifts in under a second.',
        heroMetric: { value: '2.5M+', label: 'Posts / hour sustained' },
        callouts: [
            {
                title: 'Why streaming first, batch second',
                body: 'Sentiment is most valuable in the first 10 minutes of a story breaking. Anything older than that window is an after-action report, not a real-time signal.',
            },
            {
                title: 'What changed once we fine-tuned BERT',
                body: 'Off-the-shelf sentiment models confused Tamil-English code-mixed posts. One epoch of fine-tuning on labelled regional data cut our error rate by 17%.',
            },
        ],
    },
];

export function getCaseStudy(slug: string): CaseStudy | null {
    return CASE_STUDIES.find((c) => c.projectSlug === slug) ?? null;
}

export function getCaseStudyForProject(project: IProject): CaseStudy | null {
    return getCaseStudy(project.slug);
}
