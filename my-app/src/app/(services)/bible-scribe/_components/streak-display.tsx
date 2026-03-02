import { Flame, Sparkles } from "lucide-react";
import { isGraceDayAvailable } from "../_lib/streak";
import type { GraceDayState, StreakData } from "../_lib/types";

interface Props {
  streak: StreakData;
  graceDayState: GraceDayState | undefined;
  onUseGraceDay: () => void;
}

export function StreakDisplay({ streak, graceDayState, onUseGraceDay }: Props) {
  const graceAvailable = isGraceDayAvailable(graceDayState);

  // Build last 28 days calendar
  const today = new Date();
  const days: { dateStr: string; label: string; isActive: boolean; isToday: boolean }[] = [];
  const activeDateSet = new Set(streak.activeDates);

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    days.push({
      dateStr,
      label: dayNames[d.getDay()],
      isActive: activeDateSet.has(dateStr),
      isToday: i === 0,
    });
  }

  return (
    <div className="bs-streak-display bs-fade-in">
      {/* Streak counter */}
      <div className="bs-streak-header">
        <div className="bs-streak-count">
          <Flame size={20} className="bs-streak-fire" />
          <span className="bs-streak-number">{streak.currentStreak}</span>
          <span className="bs-streak-unit">day streak</span>
        </div>
        {streak.longestStreak > 0 && (
          <div className="bs-streak-best">Best: {streak.longestStreak}</div>
        )}
      </div>

      {/* Grace day status */}
      {streak.graceDayActive && (
        <div className="bs-grace-active">
          <Sparkles
            size={14}
            style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}
          />{" "}
          Grace day protecting your streak
        </div>
      )}

      {/* 28-day calendar */}
      <div className="bs-streak-calendar">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className="bs-streak-day"
            data-active={day.isActive}
            data-today={day.isToday}
          >
            <div className="bs-streak-day-label">{day.label}</div>
            <div className="bs-streak-day-dot" />
          </div>
        ))}
      </div>

      {/* Grace day button */}
      {graceAvailable && !streak.graceDayActive && streak.currentStreak === 0 && (
        <button type="button" className="bs-grace-btn" onClick={onUseGraceDay}>
          <Sparkles
            size={14}
            style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}
          />{" "}
          Use Grace Day
        </button>
      )}
      {!graceAvailable && !streak.graceDayActive && (
        <div className="bs-grace-used">Grace day used this week</div>
      )}
    </div>
  );
}
