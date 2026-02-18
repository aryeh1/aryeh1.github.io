import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── fake data ─────────────────────────────────────────── */

const INITIAL_YES = 91;

const COMMENTS = [
  { user: 'BibiHodler', text: 'הוא כבר הזמין ספה חדשה לסלון של אמא שלו, 100% נשאר', time: '2 דקות', likes: 47 },
  { user: 'FalafelTrader', text: 'מישהו שמע שהוא ביטל את הטיסה חזרה כי "יש לו דברים"', time: '5 דקות', likes: 31 },
  { user: 'ShekelMaxi', text: 'שורט עומר. הוא תמיד אומר שהוא נשאר ואז בורח', time: '12 דקות', likes: 28 },
  { user: 'HummusWhale', text: 'יש לי מידע פנימי - הוא כבר הירשם לקופת חולים', time: '18 דקות', likes: 64 },
  { user: 'TechExitGuy', text: 'הוא פתח חשבון בבנק לאומי. THIS IS BULLISH', time: '25 דקות', likes: 52 },
  { user: 'NegativeNancy', text: 'אתם לא מבינים, הוא רק בא לחופשה. NO על 9% זה גניבה', time: '31 דקות', likes: 15 },
  { user: 'ArmyDodger69', text: 'חבר שלו סיפר לי שהוא כבר חתם על חוזה שכירות ברמת גן', time: '45 דקות', likes: 89 },
  { user: 'KibbutzKing', text: 'ברגע שהוא טעם חומוס אבו חסן - אין חזרה. ALL IN YES', time: '1 שעה', likes: 73 },
];

const ACTIVITY_LOG = [
  { action: 'קנה', side: 'YES' as const, amount: '₪4,200', user: 'Anonymous', time: '00:32' },
  { action: 'קנה', side: 'YES' as const, amount: '₪850', user: 'HummusWhale', time: '01:15' },
  { action: 'מכר', side: 'NO' as const, amount: '₪12,000', user: 'Anonymous', time: '02:44' },
  { action: 'קנה', side: 'YES' as const, amount: '₪320', user: 'FalafelTrader', time: '03:01' },
  { action: 'קנה', side: 'NO' as const, amount: '₪1,500', user: 'NegativeNancy', time: '04:22' },
  { action: 'קנה', side: 'YES' as const, amount: '₪69,420', user: 'ArmyDodger69', time: '05:00' },
];

/* ── helpers (called once, outside render) ─────────────── */

// Seeded PRNG for deterministic chart — avoids Math.random() in render
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const CHART_BASE_POINTS: number[] = (() => {
  const rng = seededRandom(42);
  const pts: number[] = [];
  let v = 55;
  for (let i = 0; i <= 60; i++) {
    v += (rng() - 0.42) * 5;
    v = Math.max(30, Math.min(97, v));
    pts.push(v);
  }
  return pts;
})();

const INITIAL_TRADERS = Math.floor(seededRandom(99)() * 300) + 1842;

/* ── mini chart (SVG) ──────────────────────────────────── */

function MiniChart({ pct }: { pct: number }) {
  const points = useMemo(() => {
    const pts = [...CHART_BASE_POINTS];
    pts[pts.length - 1] = pct;
    pts[pts.length - 2] = pct - 1.2;
    pts[pts.length - 3] = pct - 0.5;
    return pts;
  }, [pct]);

  const w = 600;
  const h = 160;
  const stepX = w / (points.length - 1);
  const pathD = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - 20) / 80) * h;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  const fillD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40 md:h-48">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {[25, 50, 75].map((v) => {
        const y = h - ((v - 20) / 80) * h;
        return (
          <g key={v}>
            <line x1={0} y1={y} x2={w} y2={y} stroke="#333" strokeWidth={0.5} strokeDasharray="4 4" />
            <text x={w - 4} y={y - 4} fill="#666" fontSize={11} textAnchor="end">{v}%</text>
          </g>
        );
      })}
      <path d={fillD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinejoin="round" />
      {/* current dot */}
      <circle cx={w} cy={h - ((pct - 20) / 80) * h} r={4} fill="#22c55e" />
    </svg>
  );
}

/* ── main page ─────────────────────────────────────────── */

export function SoliMarket() {
  const [yesPct, setYesPct] = useState(INITIAL_YES);
  const [volume, setVolume] = useState(284720);
  const [showToast, setShowToast] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [traders] = useState(INITIAL_TRADERS);

  // simulate live price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setYesPct((p) => {
        const delta = (Math.random() - 0.35) * 0.8;
        return Math.round(Math.min(99, Math.max(60, p + delta)));
      });
      setVolume((v) => v + Math.floor(Math.random() * 500) + 50);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleBuy(side: 'YES' | 'NO') {
    const msgs =
      side === 'YES'
        ? [
            '!נרשמת בהצלחה. עומר לא יודע על זה, וזה עדיף ככה',
            'ההימור נקלט! עומר כרגע אוכל שווארמה ולא מתכנן לזוז',
            'YES! כמוך, כמו 91% מהמדינה',
          ]
        : [
            '?באמת? NO? מעניין... אתה מכיר את עומר אישית',
            'ההימור נקלט. אבל ברצינות, הוא כבר קנה פה דירה',
            'NO רשום. יש לך אומץ, חייבים להגיד',
          ];
    setShowToast(msgs[Math.floor(Math.random() * msgs.length)]);
    setTimeout(() => setShowToast(''), 3500);
  }

  const noPct = 100 - yesPct;

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100" dir="rtl">
      {/* ─── header bar ─── */}
      <header className="border-b border-gray-800 bg-[#161b22]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎰</span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-green-400">Soli</span>Market
            </span>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full mr-2">BETA</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>🔴 LIVE</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">שווקי הימורים מבוססי שמועות מבית סולי</span>
          </div>
        </div>
      </header>

      {/* ─── main content ─── */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">

        {/* breadcrumb */}
        <div className="text-xs text-gray-600 mb-4">
          שווקים &gt; ישראל &gt; עומר &gt; <span className="text-gray-400">האם יתקע</span>
        </div>

        {/* ─── market card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden"
        >
          {/* title section */}
          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    🇮🇱 ישראל
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    🔥 טרנדינג
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    חברים
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                  ?האם עומר יתקע בישראל
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  השוק הזה ייסגר כ-&quot;כן&quot; אם עומר עדיין נמצא פיזית בישראל ב-1 ביולי 2026.
                  <br />
                  ראיות מקובלות: צ&apos;ק-אין בפייסבוק, סטורי באינסטגרם עם חומוס, או עדות של לפחות 3 שכנים.
                </p>
              </div>

              {/* big percentage */}
              <div className="text-center md:text-left shrink-0">
                <div className="text-5xl md:text-6xl font-bold text-green-400">
                  {yesPct}%
                </div>
                <div className="text-xs text-gray-500 mt-1">סיכוי (כן)</div>
              </div>
            </div>
          </div>

          {/* chart */}
          <div className="px-5 md:px-8 pb-2">
            <MiniChart pct={yesPct} />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1 px-1">
              <span>ינואר</span>
              <span>פברואר</span>
              <span>מרץ</span>
              <span>אפריל</span>
              <span>מאי</span>
              <span>היום</span>
            </div>
          </div>

          {/* stats bar */}
          <div className="mx-5 md:mx-8 my-4 py-3 border-t border-b border-gray-800 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
            <div>
              <span className="text-gray-400 font-medium">₪{volume.toLocaleString()}</span>
              <span className="mr-1">ווליום</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">₪18,340</span>
              <span className="mr-1">נזילות</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">{traders.toLocaleString()}</span>
              <span className="mr-1">סוחרים</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">1 ביולי 2026</span>
              <span className="mr-1">נסגר</span>
            </div>
          </div>

          {/* buy buttons */}
          <div className="p-5 md:px-8">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleBuy('YES')}
                className="relative group bg-green-500/10 hover:bg-green-500/20 border border-green-500/30
                           rounded-xl py-4 px-4 transition-all duration-200 cursor-pointer"
              >
                <div className="text-green-400 font-bold text-lg">כן (YES)</div>
                <div className="text-green-400/70 text-2xl font-bold mt-1">{yesPct}¢</div>
                <div className="text-[10px] text-gray-600 mt-1">תרוויח ₪{(100 / yesPct * 10).toFixed(0)} על כל ₪10</div>
              </button>
              <button
                onClick={() => handleBuy('NO')}
                className="relative group bg-red-500/10 hover:bg-red-500/20 border border-red-500/30
                           rounded-xl py-4 px-4 transition-all duration-200 cursor-pointer"
              >
                <div className="text-red-400 font-bold text-lg">לא (NO)</div>
                <div className="text-red-400/70 text-2xl font-bold mt-1">{noPct}¢</div>
                <div className="text-[10px] text-gray-600 mt-1">תרוויח ₪{(100 / noPct * 10).toFixed(0)} על כל ₪10</div>
              </button>
            </div>
          </div>

          {/* progress bar */}
          <div className="px-5 md:px-8 pb-6">
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden flex">
              <motion.div
                className="bg-green-500 rounded-r-full"
                initial={{ width: 0 }}
                animate={{ width: `${yesPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <motion.div
                className="bg-red-500 rounded-l-full"
                initial={{ width: 0 }}
                animate={{ width: `${noPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-green-400">{yesPct}% כן</span>
              <span className="text-red-400">לא {noPct}%</span>
            </div>
          </div>
        </motion.div>

        {/* ─── tabs: comments / activity ─── */}
        <div className="mt-6">
          <div className="flex gap-1 border-b border-gray-800 mb-4">
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'comments'
                  ? 'text-white border-b-2 border-green-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              תגובות ({COMMENTS.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'text-white border-b-2 border-green-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              פעילות
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'comments' ? (
              <motion.div
                key="comments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {COMMENTS.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#161b22] rounded-xl border border-gray-800 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
                          {c.user[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-300">{c.user}</span>
                      </div>
                      <span className="text-[10px] text-gray-600">לפני {c.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                      <span className="cursor-pointer hover:text-green-400 transition-colors">▲ {c.likes}</span>
                      <span className="cursor-pointer hover:text-gray-400 transition-colors">↩ תגובה</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {ACTIVITY_LOG.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#161b22] rounded-lg border border-gray-800 px-4 py-3 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        a.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {a.side}
                      </span>
                      <span className="text-gray-400">{a.user}</span>
                      <span className="text-gray-600">{a.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 font-medium">{a.amount}</span>
                      <span className="text-[10px] text-gray-600">לפני {a.time}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 mb-8 text-center"
        >
          <p className="text-[10px] text-gray-700 leading-relaxed max-w-md mx-auto">
            SoliMarket אינו שוק הימורים אמיתי. אף שקל לא נפגע בעשיית הדף הזה.
            <br />
            עומר, אם אתה קורא את זה — אנחנו אוהבים אותך. תישאר.
          </p>
          <p className="text-[10px] text-gray-800 mt-2">© 2026 SoliMarket — A Soli Production</p>
        </motion.div>
      </main>

      {/* ─── toast notification ─── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#161b22] border border-gray-700
                       rounded-xl px-6 py-3 text-sm text-gray-200 shadow-2xl z-50 max-w-sm text-center"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
