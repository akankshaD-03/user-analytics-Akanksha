import { Hono } from 'hono';
import { connectDB } from '../db/mongo';

const router = new Hono();

router.get('/', async (c) => {
  const pageUrl = c.req.query('url');
  if (!pageUrl) return c.json({ error: 'url required' }, 400);

  const db = await connectDB();

  const points = await db.collection('events').find(
    {
      event_type: 'click',
      page_url: pageUrl,
      x: { $ne: null },
      y: { $ne: null }
    },
    {
      projection: { x: 1, y: 1, _id: 0 }
    }
  ).toArray();

  return c.json(points);
});

export default router;
