// src/Components/LineChartCard.jsx
import React, { useMemo, useState, useEffect } from 'react';

const LineChartCard = () => {
  const [selectedView, setSelectedView] = useState('monthly');
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data sets for monthly and yearly views
  const monthlyData = [
    { month: '1', visits: 35.0 }, 
    { month: '2', visits: 62.5 }, 
    { month: '3', visits: 31.6 }, 
    { month: '4', visits: 34.0 }, 
    { month: '5', visits: 44.3 }, 
    { month: '6', visits: 11.0 }, 
    { month: '7', visits: 25.5 }, 
    { month: '8', visits: 50.0 }, 
    { month: '9', visits: 40.8 }, 
    { month: '10', visits: 55.2 }, 
    { month: '11', visits: 38.7 }, 
    { month: '12', visits: 47.9 }, 
  ];

  const yearlyData = [
    { year: '2021', visits: 450 },
    { year: '2022', visits: 620 },
    { year: '2023', visits: 550 },
    { year: '2024', visits: 700 },
    { year: '2025', visits: 680 },
  ];

  useEffect(() => {
    setLoading(true);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (selectedView === 'monthly') {
      const chartData = monthlyData.sort((a, b) => parseInt(a.month) - parseInt(b.month)).map(item => item.visits);
      setData(chartData);
      setLabels(months);
    } else { // 'yearly'
      const years = yearlyData.map(item => item.year);
      const visits = yearlyData.map(item => item.visits);
      setData(visits);
      setLabels(years);
    }

    setLoading(false);
  }, [selectedView]);

  const { pathD, areaD, points } = useMemo(() => {
    if (data.length === 0) return { pathD: '', areaD: '', points: [] };

    const w = 680;
    const h = 240;
    const padX = 24;
    const padY = 24;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;

    const maxY = Math.max(...data) * 1.1 || 1;
    const stepX = innerW / (data.length - 1);

    const pts = data.map((val, idx) => {
      const x = padX + idx * stepX;
      const y = padY + (innerH - (val / maxY) * innerH);
      return { x, y, val };
    });

    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const area = `${d} L ${pts[pts.length - 1].x},${h - padY} L ${pts[0].x},${h - padY} Z`;

    return { pathD: d, areaD: area, points: pts };
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-gray-800">Medical center Visits Statistics</div>
          <div className="text-xs text-gray-500">
            Visits over the last {selectedView === 'monthly' ? '12 months' : '5 years'}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSelectedView('monthly')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedView === 'monthly' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setSelectedView('yearly')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedView === 'yearly' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="px-2 py-4 md:px-4">
        {loading ? (
          <div className="h-56 flex items-center justify-center text-gray-500">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-gray-500">No data available.</div>
        ) : (
          <>
            <svg viewBox="0 0 680 240" className="w-full h-56">
              <g stroke="#e5e7eb" strokeWidth="1">
                <line x1="24" y1="40" x2="656" y2="40" />
                <line x1="24" y1="100" x2="656" y2="100" />
                <line x1="24" y1="160" x2="656" y2="160" />
                <line x1="24" y1="216" x2="656" y2="216" />
              </g>
              <path d={areaD} fill="url(#areaFill)" />
              <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="2.5" />
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3.5" fill="#ef4444" />
                </g>
              ))}
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
            <div className="px-4 grid grid-cols-12 text-[10px] text-gray-500 -mt-2">
              {labels.map((m, i) => (
                <div className="text-center" key={m + i} style={{ gridColumn: `span 1 / span 1` }}>
                  {m}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LineChartCard;