import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Sun, Moon, Sparkles } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TIME_SLOTS = [
  { label: 'Dawn', time: '07:00', icon: Sun },
  { label: 'Morning', time: '10:00', icon: Sparkles },
  { label: 'Noon', time: '13:00', icon: Sun },
  { label: 'Twilight', time: '17:00', icon: Moon },
  { label: 'Evening', time: '20:00', icon: Moon },
  { label: 'Midnight', time: '23:00', icon: Sparkles },
];

export default function CelestialCalendar({ selectedDate, onDateChange, themeColor, themeGradient, unavailableSlots = [] }) {
  const [viewDate, setViewDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, current: true, date: new Date(year, month, i) });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false, date: new Date(year, month + 1, i) });
    }

    return days;
  }, [viewDate]);

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    return formatDateKey(date) === formatDateKey(new Date());
  };

  const isSelected = (date) => {
    return formatDateKey(date) === selectedDate;
  };

  const handleDateClick = (date) => {
    onDateChange(formatDateKey(date));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* CALENDAR GRID */}
      <div className="glass" style={{ 
        padding: 'clamp(16px, 4vw, 24px)', 
        borderRadius: 24, 
        background: 'rgba(255, 255, 255, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#0a0a0c', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0c', padding: 4 }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0c', padding: 4 }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: 'clamp(4px, 1.5vw, 8px)', 
          textAlign: 'center',
          marginBottom: 12
        }}>
          {DAYS.map(day => (
            <span key={day} style={{ fontFamily: 'var(--font-heading)', fontSize: 10, color: 'rgba(10, 10, 12, 0.4)', textTransform: 'uppercase', fontWeight: 600 }}>
              {day}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1.5vw, 8px)' }}>
          {calendarData.map((d, i) => {
            const active = isSelected(d.date);
            const today = isToday(d.date);
            
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(d.date)}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: 12,
                  border: active ? `2px solid ${themeColor}` : 'none',
                  background: active ? themeColor : today ? 'rgba(255,255,255,0.6)' : 'transparent',
                  color: active ? 'white' : d.current ? '#0a0a0c' : 'rgba(10, 10, 12, 0.2)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  fontWeight: active || today ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                {d.day}
                {today && !active && (
                  <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', background: themeColor }} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
