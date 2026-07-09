import React, { useState, useEffect, useRef } from 'react';



const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b',
  '#10b981','#3b82f6','#ef4444','#14b8a6',
];

function getColor(id) { return COLORS[(id - 1) % COLORS.length]; }

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-4.34-7.07-1.41 1.41M6.34 17.66l-1.41 1.41"/>
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

const ITEMS_PER_PAGE = 50;

/* ── Flip Clock ───────────────────────────────────────── */
function FlipCard({ digit }) {
  const [state, setState] = useState({ curr: digit, prev: digit, animating: false });

  if (digit !== state.curr) {
    setState({ curr: digit, prev: state.curr, animating: true });
  }

  useEffect(() => {
    if (state.animating) {
      const t = setTimeout(() => setState(s => ({ ...s, animating: false })), 500);
      return () => clearTimeout(t);
    }
  }, [state.animating, state.curr]);

  const { curr, prev, animating } = state;

  return (
    <div className="fc">
      {/* Static top – new digit */}
      <div className="fc-top">
        <div className="fc-inner"><span>{curr}</span></div>
      </div>
      {/* Static bottom – old digit while animating, then new */}
      <div className="fc-bot">
        <div className="fc-inner"><span>{animating ? prev : curr}</span></div>
      </div>
      {/* Divider line */}
      <div className="fc-line" />

      {animating && (
        <>
          {/* Fold down: old digit top half */}
          <div className="fc-top fc-flap-top">
            <div className="fc-inner"><span>{prev}</span></div>
          </div>
          {/* Unfold down: new digit bottom half */}
          <div className="fc-bot fc-flap-bot">
            <div className="fc-inner"><span>{curr}</span></div>
          </div>
        </>
      )}
    </div>
  );
}

function FlipClock({ time }) {
  const pad = n => String(n).padStart(2, '0');
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  return (
    <div className="flip-clock">
      <div className="fc-group"><FlipCard digit={h[0]} /><FlipCard digit={h[1]} /></div>
      <span className="fc-sep">:</span>
      <div className="fc-group"><FlipCard digit={m[0]} /><FlipCard digit={m[1]} /></div>
      <span className="fc-sep">:</span>
      <div className="fc-group"><FlipCard digit={s[0]} /><FlipCard digit={s[1]} /></div>
    </div>
  );
}

const MONTHS_UZ = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const DAYS_UZ   = ['Du','Se','Ch','Pa','Ju','Sh','Ya'];

function DatePickerPopup({ value, onChange, onClose }) {
  const [year, month] = value ? value.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // make Mon=0
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1;
    if (isCurrentMonth) return;
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  };
  const isNextDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1;

  const selectDay = (d) => {
    if (!d) return;
    const ds = `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (ds > todayStr) return;
    onChange(ds);
    onClose();
  };

  return (
    <div className="cal-popup">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft /></button>
        <span className="cal-month-label">{MONTHS_UZ[viewMonth - 1]} {viewYear}</span>
        <button className={`cal-nav-btn ${isNextDisabled ? 'cal-nav-disabled' : ''}`} onClick={nextMonth} disabled={isNextDisabled}><ChevronRight /></button>
      </div>
      <div className="cal-grid">
        {DAYS_UZ.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const ds = `${viewYear}-${String(viewMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isFuture  = ds > todayStr;
          const isToday   = ds === todayStr;
          const isSelected= ds === value;
          return (
            <button
              key={d}
              className={`cal-day ${isToday ? 'cal-today' : ''} ${isSelected ? 'cal-selected' : ''} ${isFuture ? 'cal-future' : ''}`}
              onClick={() => selectDay(d)}
              disabled={isFuture}
            >{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function NavDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="nav-cal-wrap" ref={ref} style={{ position: 'relative' }}>
      <button
        className={`nav-cal-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Sana tanlash"
        title={value}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>
      {open && (
        <DatePickerPopup
          value={value}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [time, setTime]   = useState(new Date());
  const [page, setPage]   = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  });

  // API dan kelgan ma'lumotlarni saqlash uchun state
  const [employees, setEmployees] = useState([]);

  // ─── Token management ─────────────────────────────────────────────────────
  // Murodli Savdo (yoki yangi korxona) kalitlari:
  const CLIENT_ID     = import.meta.env.VITE_CLIENT_ID || '85D661F8BD5A74003FC1F938387266D3';
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || '158B27DBE600131FED027B078324AB4A5FE23C4F8CA2EB3F0491A9EA8AF6E5481D9480B92E503B5F082495B255162B8E4AC44004FEAA02DC50E581133A69C9AE';

  // Token olish yoki keshdan qaytarish
  async function getAccessToken() {
    const cached = JSON.parse(localStorage.getItem('verifix_token_v2') || 'null');
    // Token bor va hali 5 daqiqa muddati bor bo'lsa – uni ishlatamiz
    if (cached && Date.now() < cached.expiresAt - 5 * 60 * 1000) {
      return cached.token;
    }

    // Yangi token olamiz
    const res = await fetch('/oauth-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type:    'client_credentials',
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope:         'read'
      })
    });

    if (!res.ok) throw new Error('Token olishda xato: ' + res.status);

    const data = await res.json();
    const expiresAt = Date.now() + data.expires_in * 1000; // 10800 sekund = 3 soat
    localStorage.setItem('verifix_token_v2', JSON.stringify({ token: data.access_token, expiresAt }));
    console.log('Yangi token olindi, muddati:', new Date(expiresAt).toLocaleTimeString());
    return data.access_token;
  }

  // API orqali backend'ga ulanish
  useEffect(() => {
    async function fetchTimesheet() {
      try {
        const [year, month, day] = selectedDate.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        // Avval token olamiz (keshdan yoki API dan)
        const token = await getAccessToken();

        // Keyin timesheet so'rovini yuboramiz
        const response = await fetch('/api-proxy/b/vhr/api/v1/core/timesheet$export', {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
            'project_code':  'vhr'
          },
          body: JSON.stringify({
            period_begin_date: formattedDate,
            period_end_date:   formattedDate,
            division_ids:      [],
            employee_ids:      []
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Backend dan kelgan ma'lumot:", data);

          let apiEmployees = [];

          if (data && data.data) {
            apiEmployees = data.data.map((emp, index) => {
              const day = (emp.days && emp.days.length > 0) ? emp.days[emp.days.length - 1] : null;
              
              const extractTime = (timeStr) => {
                if (!timeStr || typeof timeStr !== 'string') return null;
                const parts = timeStr.trim().split(' ');
                const timePart = parts.length > 1 ? parts[1] : parts[0];
                return timePart ? timePart.substring(0, 5) : null;
              };

              const formatName = (fullName) => {
                if (!fullName || typeof fullName !== 'string') return "Noma'lum xodim";
                const parts = fullName.trim().split(/\s+/);
                const formatPart = (p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
                const first = parts[0] ? formatPart(parts[0]) : '';
                const second = parts[1] ? formatPart(parts[1]) : '';
                if (first && second) return `${first} ${second}`;
                return first || "Noma'lum xodim";
              };

              const inTime  = extractTime(day ? day.input_time : null) || '-';
              const outTime = extractTime(day ? day.output_time : null) || '-';
              const isWorkDay = (day && day.day_kind === 'W');

              let status = 'absent';
              if (inTime !== '-') {
                if (!isWorkDay) {
                  status = 'on_time';
                } else {
                  const planIn = extractTime(day ? day.begin_time : null) || '09:00';
                  status = (inTime > planIn) ? 'late' : 'on_time';
                }
              } else {
                if (day && day.day_kind && day.day_kind !== 'W') {
                  status = 'day_off';
                }
              }

              const timeToMinutes = (t) => {
                if (!t || t === '-') return 0;
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
              };

              const planIn = extractTime(day ? day.begin_time : null) || '09:00';
              const planOut = extractTime(day ? day.end_time : null) || '18:00';
              const planInMins = timeToMinutes(planIn);
              const planOutMins = timeToMinutes(planOut);
              const inMins = inTime !== '-' ? timeToMinutes(inTime) : planInMins;
              const outMins = outTime !== '-' ? timeToMinutes(outTime) : planOutMins;

              let missedMins = 0;
              if (status === 'late' || status === 'on_time') {
                // Kech kelish vaqti
                if (inTime !== '-' && inMins > planInMins) {
                  missedMins += inMins - planInMins;
                }
                // Erta ketish vaqti
                if (outTime !== '-' && outMins < planOutMins) {
                  missedMins += planOutMins - outMins;
                }
              }

              const formatMissedTime = (mins) => {
                if (!mins || mins <= 0) return '';
                const h = Math.floor(mins / 60);
                const m = mins % 60;
                if (h > 0 && m > 0) return `${h}h ${m}min`;
                if (h > 0) return `${h}h`;
                return `${m}min`;
              };

              return {
                id:       emp.staff_id || index + 1,
                name:     formatName(emp.employee_name),
                role:     emp.job_name || '-',
                checkIn:  inTime,
                checkOut: outTime,
                status:   status,
                missed:   formatMissedTime(missedMins)
              };
            });
          }

          if (apiEmployees.length > 0) setEmployees(apiEmployees);

        } else if (response.status === 401) {
          // Token eskirgan bo'lsa – keshni o'chirib qayta urinamiz
          localStorage.removeItem('verifix_token_v2');
          console.warn('Token eskirgan, qayta token olinmoqda...');
          await fetchTimesheet();
        } else {
          console.error('Backend xatosi:', response.status);
        }
      } catch (error) {
        console.error("Backend ga ulanishda xato:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimesheet();

    // Har 3 soatda avtomatik ma'lumotlarni yangilash
    const refreshInterval = setInterval(fetchTimesheet, 3 * 60 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [selectedDate]);

  const handleFilter = (val) => {
    setFilter(val);
    setPage(1);
  };

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const fmtDate = (d) =>
    d.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const [sortByTime, setSortByTime] = useState(false);
  const [sortByMissed, setSortByMissed] = useState(false);

  const timeToMins = (t) => {
    if (!t || t === '-') return 9999;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const missedToMins = (missed) => {
    if (!missed) return 0;
    let total = 0;
    const hMatch = missed.match(/(\d+)h/);
    const mMatch = missed.match(/(\d+)min/);
    if (hMatch) total += parseInt(hMatch[1]) * 60;
    if (mMatch) total += parseInt(mMatch[1]);
    return total;
  };

  const filtered = employees.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sorted = sortByMissed
    ? [...filtered].sort((a, b) => missedToMins(b.missed) - missedToMins(a.missed))
    : sortByTime
      ? [...filtered].sort((a, b) => timeToMins(a.checkIn) - timeToMins(b.checkIn))
      : filtered;

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE) || 1;
  const start      = (page - 1) * ITEMS_PER_PAGE;
  const visible    = sorted.slice(start, start + ITEMS_PER_PAGE);

  const stats = {
    total:   employees.length,
    on_time: employees.filter(e => e.status === 'on_time').length,
    late:    employees.filter(e => e.status === 'late').length,
    absent:  employees.filter(e => e.status === 'absent').length,
  };

  return (
    <div className="app-root">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* LOADING SCREEN */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: theme === 'light' ? 'radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 100%)' : 'radial-gradient(ellipse at center, #0d0d1a 0%, #060610 100%)',
        }}>
          <style>{`
            @keyframes ring-spin-1 { to { transform: rotate(360deg); } }
            @keyframes ring-spin-2 { to { transform: rotate(-360deg); } }
            @keyframes ring-spin-3 { to { transform: rotate(360deg); } }
            @keyframes logo-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.92)} }
            @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-12px)} }
            @keyframes fade-in-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
            @keyframes shimmer-bar { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          `}</style>

          {/* Halqalar */}
          <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Tashqi halqa */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid transparent',
              borderTop: '2px solid #6366f1',
              borderRight: '2px solid #6366f1',
              animation: 'ring-spin-1 1.4s linear infinite',
              boxShadow: '0 0 18px rgba(99,102,241,0.4)'
            }} />
            {/* O'rta halqa */}
            <div style={{
              position: 'absolute', inset: 16, borderRadius: '50%',
              border: '2px solid transparent',
              borderBottom: '2px solid #8b5cf6',
              borderLeft: '2px solid #8b5cf6',
              animation: 'ring-spin-2 1s linear infinite',
              boxShadow: '0 0 14px rgba(139,92,246,0.35)'
            }} />
            {/* Ichki halqa */}
            <div style={{
              position: 'absolute', inset: 32, borderRadius: '50%',
              border: '2px solid transparent',
              borderTop: '2px solid #ec4899',
              animation: 'ring-spin-3 0.7s linear infinite',
              boxShadow: '0 0 10px rgba(236,72,153,0.3)'
            }} />
            {/* Markazda V harfi */}
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff',
              animation: 'logo-pulse 2s ease-in-out infinite',
              boxShadow: '0 0 24px rgba(99,102,241,0.5)',
              letterSpacing: '-1px'
            }}>V</div>
          </div>

          {/* Matn */}
          <p style={{
            color: theme === 'light' ? '#4f46e5' : '#a5b4fc', marginTop: 28, fontSize: 14,
            letterSpacing: 2, fontWeight: 500, textTransform: 'uppercase',
            animation: 'fade-in-up 0.6s ease both'
          }}>
            Ma'lumotlar yuklanmoqda
          </p>

          {/* Uchta bouncing nuqta */}
          <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i === 0 ? '#6366f1' : i === 1 ? '#8b5cf6' : '#ec4899',
                animation: `dot-bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
                boxShadow: `0 0 8px ${i === 0 ? '#6366f1' : i === 1 ? '#8b5cf6' : '#ec4899'}`
              }} />
            ))}
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: 36, width: 180, height: 3,
            borderRadius: 99, background: 'rgba(99,102,241,0.12)', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-bar 1.6s linear infinite'
            }} />
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="brand-icon">
            <span>V</span>
          </div>
          <span className="brand-name">Verifix</span>
        </div>

        <div className="nav-right">
          {/* Custom Calendar */}
          <NavDatePicker value={selectedDate} onChange={(d) => { setSelectedDate(d); setPage(1); setLoading(true); }} />
          <button
            className={`theme-toggle ${theme}`}
            onClick={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <div className="toggle-thumb">
              {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </div>
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-text">
            <h1 className="page-title">
              {(() => {
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
                return selectedDate === todayStr ? 'Bugungi Davomat' : 'Davomat';
              })()}
            </h1>
            <p className="page-date">
              {(() => {
                const [y, m, d] = selectedDate.split('-').map(Number);
                return new Date(y, m - 1, d).toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              })()}
            </p>
          </div>
          <div className="filter-btns">
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                className="search-input"
                placeholder="Xodimni qidirish..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
            <button
              className={`filter-btn filter-late ${filter === 'late' ? 'active' : ''}`}
              onClick={() => handleFilter(filter === 'late' ? 'all' : 'late')}
            >
              <span className="filter-dot dot-late" />
              Kechikkanlar
              <span className="filter-count">{employees.filter(e => e.status === 'late').length}</span>
            </button>
            <button
              className={`filter-btn filter-absent ${filter === 'absent' ? 'active' : ''}`}
              onClick={() => handleFilter(filter === 'absent' ? 'all' : 'absent')}
            >
              <span className="filter-dot dot-absent" />
              Kelmaganlar
              <span className="filter-count">{employees.filter(e => e.status === 'absent').length}</span>
            </button>
            <button
              className={`filter-btn filter-dayoff ${filter === 'day_off' ? 'active' : ''}`}
              onClick={() => handleFilter(filter === 'day_off' ? 'all' : 'day_off')}
            >
              <span className="filter-dot dot-dayoff" />
              Damdagilar
              <span className="filter-count">{employees.filter(e => e.status === 'day_off').length}</span>
            </button>
          </div>
        </div>


{/* Table card */}
        <div className="table-card">
          <div className="table-scroll">
            <table className="emp-table">
              <thead>
                <tr>
                  <th className="th-emp">Xodim</th>
                  <th className="th-time">
                    <span className="th-inner" style={{ justifyContent: 'center', gap: 8 }}>
                      <ClockIcon /> Vaqti
                      <button
                        className={`sort-time-btn ${sortByTime ? 'active' : ''}`}
                        onClick={() => { setSortByTime(s => !s); setSortByMissed(false); setPage(1); }}
                        title="Kelish vaqti bo'yicha saralash"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h18M7 12h10M11 16h2"/>
                        </svg>
                        {sortByTime ? '↑' : '↕'}
                      </button>
                    </span>
                  </th>
                  <th className="th-time">
                    <span className="th-inner" style={{ justifyContent: 'center', gap: 8 }}>
                      Ishlanmagan
                      <button
                        className={`sort-time-btn sort-missed-btn ${sortByMissed ? 'active' : ''}`}
                        onClick={() => { setSortByMissed(s => !s); setSortByTime(false); setPage(1); }}
                        title="Ishlanmagan vaqt bo'yicha saralash"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8h18M7 12h10M11 16h2"/>
                        </svg>
                        {sortByMissed ? '↓' : '↕'}
                      </button>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((emp, idx) => {
                  let rowBg = 'transparent';
                  if (emp.status === 'late') {
                    rowBg = theme === 'dark' ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7';
                  } else if (emp.status === 'absent') {
                    rowBg = theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#FA4848';
                  } else if (emp.status === 'day_off') {
                    rowBg = 'rgba(56, 189, 248, 0.2)';
                  }

                  return (
                  <tr key={emp.id} className="emp-row" style={{ animationDelay: `${idx * 40}ms`, background: rowBg }}>
                    {/* Employee info */}
                    <td className="td-emp">
                      <div className="emp-info">
                        <div>
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-role">{emp.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="td-time">
                      {emp.checkIn !== '-' || emp.checkOut !== '-' ? (
                        <div className="time-chip" style={{ justifyContent: 'center', gap: 4 }}>
                          <span className="chip-time">{emp.checkIn !== '-' ? emp.checkIn : '--:--'}</span>
                          <span style={{ color: '#94a3b8', fontSize: 11 }}>—</span>
                          <span className="chip-time" style={{ opacity: emp.checkOut !== '-' ? 1 : 0.4 }}>{emp.checkOut !== '-' ? emp.checkOut : '--:--'}</span>
                        </div>
                      ) : (
                        <span className="no-data">—</span>
                      )}
                    </td>

                    {/* Missed Time */}
                    <td className="td-time">
                      {emp.missed ? (
                        <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 13, background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>
                          {emp.missed}
                        </span>
                      ) : (
                        <span className="no-data" style={{ opacity: 0.5 }}>—</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-bar">
            <span className="pag-info">
              Jami <strong>{filtered.length}</strong> xodimdan{' '}
              <strong>{start + 1}–{Math.min(start + ITEMS_PER_PAGE, filtered.length)}</strong> ko'rsatilmoqda
            </span>

            <div className="pag-controls">
              <button
                className="pag-btn pag-arrow"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Orqaga"
              >
                <ChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pag-btn pag-num ${page === n ? 'pag-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}

              <button
                className="pag-btn pag-arrow"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Oldinga"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
