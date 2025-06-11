import { isSameDay, isSameMonth } from "date-fns";

export function getItalianHolidays(year: number): Date[] {
  const fixed = [
    new Date(year, 0, 1), // 1 gennaio
    new Date(year, 0, 6), // Epifania
    new Date(year, 3, 25), // 25 aprile
    new Date(year, 4, 1), // 1 maggio
    new Date(year, 5, 2), // 2 giugno
    new Date(year, 7, 15), // 15 agosto
    new Date(year, 10, 1), // 1 novembre
    new Date(year, 11, 8), // 8 dicembre
    new Date(year, 11, 25), // Natale
    new Date(year, 11, 26), // Santo Stefano
  ];

  // Feste mobili: Pasqua e Pasquetta
  const easter = getEasterDate(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  return [...fixed, easter, easterMonday];
}

function getEasterDate(year: number): Date {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}
