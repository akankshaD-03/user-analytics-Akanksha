import { Hono } from 'hono';
import { connectDB } from '../db/mongo';

const router = new Hono();

router.post('/', async (c) => {
  const body = await c.req.json();

  const required = ['session_id', 'event_type', 'page_url', 'timestamp'];
  for (const key of required) {
    if (!body[key]) return c.json({ error: `${key} missing` }, 400);
  }

  const db = await connectDB();
  await db.collection('events').insertOne(body);

  return c.json({ success: true });
});

export default router;
