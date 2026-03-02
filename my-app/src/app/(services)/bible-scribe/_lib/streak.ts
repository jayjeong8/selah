import type { GraceDayState, StreakData } from "./types";

/** Returns YYYY-MM-DD for a given Date in local timezone */
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Returns the Monday of the week containing the given date */
function getWeekStart(d: Date): string {
  const copy = new Date(d);
  const day = copy.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  copy.setDate(copy.getDate() - diff);
  return toDateStr(copy);
}

/** Add N days to a date string */
function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

/**
 * Calculate streak data from a list of active dates and grace day state.
 *
 * Grace Day rules:
 * - 1 grace day per week (Mon–Sun)
 * - Can cover exactly 1 missed day in the streak
 * - Resets each Monday
 */
export function calculateStreak(
  activeDates: string[],
  graceDayState: GraceDayState | undefined,
): StreakData {
  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDates: [], graceDayActive: false };
  }

  const sorted = [...new Set(activeDates)].sort();
  const dateSet = new Set(sorted);
  const today = toDateStr(new Date());
  const yesterday = addDays(today, -1);

  // Calculate current streak (counting backwards from today)
  let currentStreak = 0;
  let graceDayActive = false;
  let checkDate = today;

  // Check if today is active
  if (dateSet.has(today)) {
    currentStreak = 1;
    checkDate = addDays(today, -1);
  } else {
    // Today not active — can a grace day save it?
    const currentWeekStart = getWeekStart(new Date());
    const graceAvailable =
      graceDayState && graceDayState.weekStart === currentWeekStart
        ? !graceDayState.usedThisWeek
        : true; // new week = grace available

    if (graceAvailable && dateSet.has(yesterday)) {
      // Grace day covers today (the gap)
      graceDayActive = true;
      currentStreak = 1; // today is "covered"
      checkDate = yesterday;
    } else {
      // Streak is broken
      return {
        currentStreak: 0,
        longestStreak: calculateLongest(sorted),
        activeDates: sorted,
        graceDayActive: false,
      };
    }
  }

  // Walk backwards
  while (dateSet.has(checkDate)) {
    currentStreak++;
    checkDate = addDays(checkDate, -1);
  }

  // Check if there's a past grace day usage that bridged a gap in the current streak
  // (only one gap allowed, and we already checked today's gap)

  const longestStreak = Math.max(currentStreak, calculateLongest(sorted));

  return { currentStreak, longestStreak, activeDates: sorted, graceDayActive };
}

/** Calculate the longest consecutive-day streak in sorted dates */
function calculateLongest(sorted: string[]): number {
  if (sorted.length === 0) return 0;

  let longest = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const expected = addDays(sorted[i - 1], 1);
    if (sorted[i] === expected) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  return longest;
}

/** Get today's date string */
export function getTodayStr(): string {
  return toDateStr(new Date());
}

/** Get current week start (Monday) */
export function getCurrentWeekStart(): string {
  return getWeekStart(new Date());
}

/** Check if grace day is available this week */
export function isGraceDayAvailable(graceDayState: GraceDayState | undefined): boolean {
  const currentWeekStart = getCurrentWeekStart();
  if (!graceDayState || graceDayState.weekStart !== currentWeekStart) {
    return true; // new week or no state = available
  }
  return !graceDayState.usedThisWeek;
}

/** Create a new grace day state after using a grace day */
export function useGraceDay(): GraceDayState {
  const today = getTodayStr();
  return {
    usedThisWeek: true,
    usedDate: today,
    weekStart: getCurrentWeekStart(),
  };
}
