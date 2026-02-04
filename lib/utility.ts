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

  return `Photo uploaded on ${month} ${day}${suffix}, ${year}`;
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
