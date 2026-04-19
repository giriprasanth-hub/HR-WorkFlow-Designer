import { http, HttpResponse } from 'msw';
import { automations } from './fixtures';
import { simulateGraph } from './simulate';

export const handlers = [
  // GET /automations handler
  http.get('/api/automations', () => {
    return HttpResponse.json(automations, { status: 200 });
  }),

  // POST /simulate handler
  http.post('/api/simulate', async ({ request }) => {
    const graph = await request.json() as any;
    
    // Simulate graph execution and generate step logs
    const logs = await simulateGraph(graph);
    
    return HttpResponse.json({ success: true, logs });
  }),
];
