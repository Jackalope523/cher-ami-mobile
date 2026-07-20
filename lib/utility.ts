export function formatPhotoDate(date: Date) {
  if (!(date instanceof Date)) date = new Date(date);

  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();

  // Determine ordinal suffix (st, nd, rd, th)
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';

  return `Photo taken on ${month} ${day}${suffix}, ${year}`;
}

/**
 * The default photo date for a new post: when the photo was taken, if we know
 * it and it falls within the current magazine's month — otherwise right now.
 */
export function defaultPhotoDate(
  takenAt: Date | null,
  issueStart: Date | null,
): Date {
  const now = new Date();

  if (!takenAt || isNaN(takenAt.getTime())) return now;
  if (takenAt > now) return now;
  if (issueStart && takenAt < issueStart) return now;

  return takenAt;
}

/**
 * Move a photo date to another calendar day while keeping its time of day
 * (the time is never shown, but keeps same-day photos in the order they were
 * taken). Clamped so the result is never in the future.
 */
export function withCalendarDay(day: Date, previous: Date): Date {
  const merged = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    previous.getHours(),
    previous.getMinutes(),
    previous.getSeconds(),
  );

  const now = new Date();
  return merged > now ? now : merged;
}

export function getNextMonthName() {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const today = new Date();
  const nextMonthIndex = (today.getMonth() + 1) % 12; // wraps December → January

  return monthNames[nextMonthIndex];
}

export function splitName(fullName: string) {
  if (!fullName) {
    return { firstName: '', lastName: '' };
  }

  const parts = fullName.trim().split(/\s+/);

  const firstName = parts.shift() ?? '';
  const lastName = parts.join(' ');

  return { firstName, lastName };
}
