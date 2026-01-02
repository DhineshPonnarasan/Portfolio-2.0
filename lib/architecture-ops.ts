import { IProject } from '@/types';

export function buildRunbookSummary(project: IProject) {
    const title = project.title;
    return [
        `**Primary objective**: Keep ${title} healthy end-to-end while respecting the data and model contracts encoded in Boxes 1 → 6.`,
        '',
        '**When things go wrong:**',
        '- Start upstream: verify inputs into Box 1 and Box 2 before assuming Box 4 or 5 are at fault.',
        '- Check latency and saturation between the transformation box and the serving box.',
        '- Confirm feedback signals from the final box are flowing; many “mystery” bugs are silent feedback failures.',
        '',
        '**SLO sketch:** latency, correctness, and freshness targets mapped to each box, with alerts on both leading and lagging indicators.',
    ].join('\n');
}

export function buildObservabilityNotes() {
    return [
        '- Logs around boundaries between Boxes 2 → 3 and 3 → 4 to capture payload shape and key decision points.',
        '- Metrics for queue depth, throughput, and error rates on every arrow, not just at the edges.',
        '- Traces that stitch Box 1 → 6 together for a single request, so you can see where time is really spent.',
    ].join('\n');
}

export function buildRolloutStrategy() {
    return [
        '- Use canary or blue/green patterns at the serving box while keeping ingestion stable.',
        '- Prefer shadow deployments first: feed real traffic into the new path but keep decisions read-only.',
        '- Tie rollout steps to observable milestones (error budget, latency, business KPIs) before promoting the new path.',
    ].join('\n');
}


