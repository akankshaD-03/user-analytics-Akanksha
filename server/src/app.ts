import { Hono } from 'hono';
import events from './routes/events';
import sessions from './routes/sessions';
import heatmap from './routes/heatmap';
import { cors } from 'hono/cors';
const app = new Hono();

app.route('/api/events', events);
app.route('/api/sessions', sessions);
app.route('/api/heatmap', heatmap);

export default app;


app.use('*', cors());
