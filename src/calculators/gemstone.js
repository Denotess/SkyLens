export function calcGemstone({ type, fortune=0, speed=0 }) {
  const baseRates = { amber:1.0, jade:0.9, amethyst:0.6, sapphire:0.7 };
  const base = baseRates[type.toLowerCase()] || 0.6;
  const fortBoost = 1 + (fortune/1000)*0.12;
  const spBoost = 1 + (speed/1000)*0.25;
  const gemsPerHour = base * fortBoost * spBoost * 3600;
  const estPrice = 120;
  const profit = Math.round(gemsPerHour * estPrice);
  return `⛏️ Gemstone: ${type}\nFortune: ${fortune}\nSpeed: ${speed}\nEst gems/hr: ${Math.round(gemsPerHour)}\nEst profit/hr: ${profit.toLocaleString()} coins\n(Replace est price with AH prices for accuracy)`;
}
