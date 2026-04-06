// Generated with BotMaker.gg — AI-Powered Discord Bot Builder
// https://botmaker.gg

export function abbreviateNumber(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export function demandLabel(demand) {
  const labels = ['None', 'Low', 'Medium', 'High', 'Very High'];
  return labels[demand] || 'Unknown';
}

export function demandBar(demand, max = 5) {
  const filled = '\u2588'.repeat(demand);
  const empty = '\u2591'.repeat(max - demand);
  return filled + empty;
}
