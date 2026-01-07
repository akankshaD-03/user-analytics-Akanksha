import { Hono } from 'hono';
import { connectDB } from '../db/mongo';

const router = new Hono();

router.get('/', async (c) => {
  const db = await connectDB();

  const sessions = await db.collection('events').aggregate([
    {
      $group: {
        _id: '$session_id',
        total_events: { $sum: 1 }
      }
    },
    {
      $project: {
        session_id: '$_id',
        total_events: 1,
        _id: 0
      }
    }
  ]).toArray();

  return c.json(sessions);
});

router.get('/:sessionId/events', async (c) => {
  const sessionId = c.req.param('sessionId');
  const db = await connectDB();

  const events = await db.collection('events')
    .find({ session_id: sessionId })
    .sort({ timestamp: 1 })
    .toArray();

  return c.json(events);
});

export default router;
