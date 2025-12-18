const GROQ_API_URL = 'https://api.groq.com/v1/chat/completions';

export async function generateMermaidDiagrams({ systemPrompt, workflowPrompt, componentPrompt }: {
  systemPrompt: string;
  workflowPrompt: string;
  componentPrompt: string;
}) {
  // Read API key from environment
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set in environment');
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  async function callGroq(prompt: string) {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.2,
      }),
    });
    const data = await res.json();
    // Extract Mermaid code only
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  return {
    system_architecture: await callGroq(systemPrompt),
    workflow_diagram: await callGroq(workflowPrompt),
    component_diagram: await callGroq(componentPrompt),
  };
}
