// Runtime validation script
const tests = [
  { name: 'Home page', url: 'http://localhost:3100/' },
  { name: 'Architecture Explorer', url: 'http://localhost:3100/architecture' },
  { name: 'Project: customer-churn', url: 'http://localhost:3100/projects/customer-churn-intelligence' },
  { name: 'Project: social-media-sentiment', url: 'http://localhost:3100/projects/social-media-sentiment' },
  { name: 'Project: brain-tumor', url: 'http://localhost:3100/projects/brain-tumor-classification' },
  { name: 'Project: yolov8', url: 'http://localhost:3100/projects/yolov8-inference-engine' },
  { name: 'Project: quantum-blood', url: 'http://localhost:3100/projects/quantum-blood-group' },
  { name: 'Project: resume-parser', url: 'http://localhost:3100/projects/resume-parser' },
  { name: 'OSS: olake', url: 'http://localhost:3100/opensource/olake-datazip' },
  { name: 'OSS: tensorflow', url: 'http://localhost:3100/opensource/tensorflow' },
  { name: 'Colorizer', url: 'http://localhost:3100/colorizer' },
  { name: 'Case study: yolov8', url: 'http://localhost:3100/case-studies/yolov8-inference-engine' },
  { name: 'API: chat (POST)', url: 'http://localhost:3100/api/chat', method: 'POST', body: { messages: [{ role: 'user', content: 'hi' }] } },
  { name: 'API: architecture (POST)', url: 'http://localhost:3100/api/architecture', method: 'POST', body: { slug: 'customer-churn-intelligence', mode: 'overview' } },
  { name: 'API: architecture-intel (POST)', url: 'http://localhost:3100/api/architecture-intel', method: 'POST', body: { projectId: 1, question: 'How does it scale?' } },
  { name: 'API: architecture-voice (POST)', url: 'http://localhost:3100/api/architecture-voice', method: 'POST', body: { projectId: 1 } },
  { name: 'API: architecture-simulate (POST)', url: 'http://localhost:3100/api/architecture-simulate', method: 'POST', body: { projectId: 1, scenario: 'traffic spike' } },
  { name: 'API: architecture-compare (POST)', url: 'http://localhost:3100/api/architecture-compare', method: 'POST', body: { firstProjectId: 1, secondProjectId: 2 } },
  { name: 'API: architecture-explain (POST)', url: 'http://localhost:3100/api/architecture-explain', method: 'POST', body: { projectId: 1 } },
  { name: 'API: architecture-challenge (POST)', url: 'http://localhost:3100/api/architecture-challenge', method: 'POST', body: { projectId: 1, attempt: 'Box 1 to Box 2' } },
  { name: 'API: enhance-diagram (POST)', url: 'http://localhost:3100/api/enhance-diagram', method: 'POST', body: { projectSlug: 'customer-churn-intelligence' } },
];

async function runTest(t) {
  const start = Date.now();
  try {
    const res = await fetch(t.url, {
      method: t.method || 'GET',
      headers: t.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
      body: t.body ? JSON.stringify(t.body) : undefined,
    });
    const text = await res.text();
    const ms = Date.now() - start;
    const hasError = res.status >= 400;
    console.log(`[${res.status}] ${t.name} (${ms}ms, ${text.length} bytes)`);
    if (res.status >= 500) {
      console.log('  BODY:', text.substring(0, 500));
    }
    return { name: t.name, status: res.status, ms, bytes: text.length };
  } catch (e) {
    const ms = Date.now() - start;
    console.log(`[ERR] ${t.name} (${ms}ms): ${e.message}`);
    return { name: t.name, status: 0, ms, error: e.message };
  }
}

(async () => {
  for (const t of tests) {
    await runTest(t);
  }
})();
