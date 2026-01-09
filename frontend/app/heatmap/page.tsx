'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface HeatmapPoint {
  x: number;
  y: number;
}

const HeatmapURL = '/src/tracker/index.html'

export default function Heatmap() {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [selectedUrl, setSelectedUrl] = useState(HeatmapURL);
  const [urls, setUrls] = useState<string[]>(['/']);
  const [loading, setLoading] = useState(false);
  const [heatmapSize, setHeatmapSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    // Try to fetch available URLs, fallback to default
    fetch('http://localhost:4000/api/urls')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUrls(data);
        }
      })
      .catch(() => {
        // If endpoint doesn't exist, use default URLs
        setUrls(['/src/tracker/index.html','/', '/about', '/contact', '/products']);
      });
  }, []);

  const loadHeatmap = useCallback(async () => {
    if (!selectedUrl) return;
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/heatmap?url=${encodeURIComponent(selectedUrl)}`);
      const data: HeatmapPoint[] = await res.json();
      setPoints(data);
      
      // Calculate heatmap dimensions from points if available
      if (data.length > 0) {
        const maxX = Math.max(...data.map((p) => p.x || 0));
        const maxY = Math.max(...data.map((p) => p.y || 0));
        setHeatmapSize({
          width: Math.max(maxX + 100, 1920),
          height: Math.max(maxY + 100, 1080)
        });
      }
    } catch (error) {
      console.error('Failed to load heatmap:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUrl]);

  // Auto-load when URL changes
  useEffect(() => {
    if (selectedUrl) {
      loadHeatmap();
    }
  }, [selectedUrl, loadHeatmap]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Click Heatmap
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Visualize user click patterns and interactions on your pages
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Page URL
              </label>
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {urls.map((url) => (
                  <option key={url} value={url}>
                    {url}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={loadHeatmap}
              disabled={loading}
              className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
          {points.length > 0 && (
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium">{points.length}</span> click{points.length !== 1 ? 's' : ''} recorded on <span className="font-mono font-medium">{selectedUrl}</span>
            </div>
          )}
        </div>

        {/* Heatmap Visualization */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Heatmap Visualization
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Each dot represents a click position. Redder dots indicate more clicks in that area.
            </p>
          </div>
          
          <div className="relative bg-slate-100 dark:bg-slate-900 overflow-auto" style={{ minHeight: '600px', maxHeight: '80vh' }}>
            {loading && points.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-300">Loading heatmap data...</p>
                </div>
              </div>
            ) : points.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-300">No click data available for this page</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Select a different URL or wait for data to be collected</p>
                </div>
              </div>
            ) : (
              <div 
                className="relative"
                style={{ 
                  width: `${heatmapSize.width}px`, 
                  height: `${heatmapSize.height}px`,
                  minHeight: '600px'
                }}
              >
                {/* Grid background */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
                
                {/* Click points */}
                {points.map((p, i) => {
                  // Calculate intensity based on nearby points (simple clustering)
                  const nearbyCount = points.filter((other) => {
                    const distance = Math.sqrt(
                      Math.pow((other.x || 0) - (p.x || 0), 2) + 
                      Math.pow((other.y || 0) - (p.y || 0), 2)
                    );
                    return distance < 50;
                  }).length;
                  
                  const intensity = Math.min(nearbyCount / 5, 1);
                  const size = 8 + intensity * 12;
                  const opacity = 0.6 + intensity * 0.4;
                  
                  return (
                    <div
                      key={i}
                      className="absolute rounded-full transition-all duration-300 hover:scale-150 hover:z-10"
                      style={{
                        left: `${p.x || 0}px`,
                        top: `${p.y || 0}px`,
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `rgba(239, 68, 68, ${opacity})`,
                        boxShadow: `0 0 ${size * 2}px rgba(239, 68, 68, ${opacity * 0.5})`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer'
                      }}
                      title={`Click at (${Math.round(p.x || 0)}, ${Math.round(p.y || 0)})`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
