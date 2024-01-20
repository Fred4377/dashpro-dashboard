export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatRelativeTime = (dateString) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInMs = new Date(dateString) - new Date();
  const diffInMins = Math.round(diffInMs / (1000 * 60));
  
  if (Math.abs(diffInMins) < 60) return rtf.format(diffInMins, 'minute');
  const diffInHours = Math.round(diffInMins / 60);
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, 'hour');
  const diffInDays = Math.round(diffInHours / 24);
  return rtf.format(diffInDays, 'day');
};
