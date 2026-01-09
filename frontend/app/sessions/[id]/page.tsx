'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface Event {
  event_type: string;
  page_url: string;
  timestamp?: string;
}

interface SessionDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SessionDetail({ params }: SessionDetailProps) {
  const { id } = use(params);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/sessions/${id}/events`)
      .then(res => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const getEventIcon = (eventType: string) => {
    switch (eventType?.toLowerCase()) {
      case 'click':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        );
      case 'pageview':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType?.toLowerCase()) {
      case 'click':
        return 'from-blue-500 to-blue-600';
      case 'pageview':
        return 'from-green-500 to-green-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/sessions"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sessions
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Session {id}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            User journey timeline with {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Timeline */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300">No events found for this session</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
            
            <div className="space-y-6">
              {events.map((e, i) => (
                <div key={i} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full bg-linear-to-br ${getEventColor(e.event_type)} flex items-center justify-center shadow-lg`}>
                    <div className="text-white">
                      {getEventIcon(e.event_type)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                      {i + 1}
                    </div>
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                          {e.event_type || 'Event'}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Step {i + 1} of {events.length}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="text-sm font-mono">{e.page_url || '/'}</span>
                      </div>
                      {e.timestamp && (
                        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mt-2 text-xs">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(e.timestamp).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
