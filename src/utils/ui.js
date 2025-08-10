export function progressBar(ratio, length=10) {
  const filled = Math.round(Math.max(0, Math.min(1, ratio)) * length);
  const empty = length - filled;
  return '|' + '█'.repeat(filled) + '░'.repeat(empty) + '|';
}
