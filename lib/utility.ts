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

/**
 * Builds an ISO `YYYY-MM-DD` string from separate fields, or null when the
 * pieces don't describe a real past date. Rejects roll-over dates like
 * Feb 31st, which `new Date()` would silently accept.
 */
export function toIsoDate(
  year: string,
  month: string,
  day: string,
): string | null {
  if (!year || !month || !day) return null;

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
    return null;
  }
  if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return null;

  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  if (date > new Date()) return null;

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}`;
}

/**
 * When the first magazine ships and when billing actually starts.
 *
 * A magazine closes at the end of its drafting window and is printed and
 * mailed the month after. Billing only ever happens when a magazine is sent,
 * so a charge lands on the 1st of the month a magazine goes out.
 *
 * The free first magazine (one per circle) shifts that by a month: the first
 * shipment costs nothing, so the first charge is for the one after it.
 * Signing up on July 30th is the case worth checking — that magazine closes
 * August 31st and ships in September, so the first charge is October 1st with
 * the free magazine, or September 1st without it.
 */
export function billingSchedule(
  issueCloseDate: Date | string | null,
  freeFirstMagazine: boolean,
) {
  const close = issueCloseDate ? new Date(issueCloseDate) : null;

  if (!close || isNaN(close.getTime())) return null;

  const chargeMonthOffset = freeFirstMagazine ? 2 : 1;

  // All arithmetic and formatting stays in UTC. The close date is the last
  // instant of a month in UTC, so reading it with local getters rolls into the
  // next month for anyone east of UTC and reports every date a month late.
  const firstShipment = new Date(
    Date.UTC(close.getUTCFullYear(), close.getUTCMonth() + 1, 1),
  );
  const firstCharge = new Date(
    Date.UTC(close.getUTCFullYear(), close.getUTCMonth() + chargeMonthOffset, 1),
  );

  const monthName = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });

  return {
    closesOn: close.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    firstShipmentMonth: monthName(firstShipment),
    firstChargeMonth: monthName(firstCharge),
    firstChargeDate: `${monthName(firstCharge)} 1st`,
  };
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

export type PrintSharpness = {
  level: 'fine' | 'soft' | 'poor';
  message: string;
};

/**
 * How well a crop will hold up in print.
 *
 * The layouts in `post/size.tsx` state the pixels each slot needs at 300 DPI, so
 * the crop's own pixel size against that target is the whole answer — a ratio of
 * 1 needs no upscaling, 0.5 means the printer has to double it and prints at
 * roughly 150 DPI. Returns null when there's nothing worth saying.
 */
export function printSharpness(
  cropWidth: number,
  cropHeight: number,
  targetWidth: number,
  targetHeight: number,
): PrintSharpness | null {
  if (
    !cropWidth ||
    !cropHeight ||
    !targetWidth ||
    !targetHeight ||
    cropWidth < 0 ||
    cropHeight < 0
  ) {
    return null;
  }

  // The tighter of the two axes decides it: that's the one that has to stretch
  // furthest to fill the slot.
  const ratio = Math.min(cropWidth / targetWidth, cropHeight / targetHeight);

  // ~225 DPI and up looks fine on glossy stock.
  if (ratio >= 0.75) return null;

  // Down to ~150 DPI: noticeable to a careful eye, fine for a casual snapshot.
  if (ratio >= 0.5) {
    return {
      level: 'soft',
      message:
        'This photo may look a little soft in print. It will still look lovely — a larger original would be a touch sharper.',
    };
  }

  return {
    level: 'poor',
    message:
      'This photo is quite small, so it may look blurry in print. If you have the original — not a screenshot or a copy from a message — that version would print much better.',
  };
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
