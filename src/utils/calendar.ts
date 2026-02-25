/**
 * Hijri-Gregorian conversion utilities
 * Based on standard astronomical algorithms
 */

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number; // 1-12
  day: number;
}

// Simple conversion algorithm (Kuwaiti algorithm variant)
export function gregorianToHijri(date: Date): HijriDate {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let m = month;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10 && day > 14) b = -10;
  }

  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

  let b1 = 0;
  if (jd > 2299160) {
    let a1 = Math.floor((jd - 1867216.25) / 36524.25);
    b1 = 1 + a1 - Math.floor(a1 / 4);
  }
  let bb = jd + b1 + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  
  // Hijri calculation
  let ijd = jd - 1948440 + 10632;
  let n = Math.floor((ijd - 1) / 10631);
  ijd = ijd - 10631 * n;
  let j = Math.floor((ijd - 1) / 354.36667);
  ijd = ijd - Math.floor(j * 354.36667 + 0.5);
  
  let hYear = n * 30 + j;
  let hMonth = Math.floor((ijd + 28.5001) / 29.5);
  if (hMonth === 13) hMonth = 12;
  let hDay = ijd - Math.floor(hMonth * 29.5 - 28.999);

  return { year: hYear, month: hMonth, day: hDay };
}

export function hijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
  // Reverse conversion
  let jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  
  if (jd > 2299160) {
    let l = jd + 68569;
    let n = Math.floor((4 * l) / 146097);
    l = l - Math.floor((146097 * n + 3) / 4);
    let i = Math.floor((4000 * (l + 1)) / 1461001);
    l = l - Math.floor((1461 * i) / 4) + 31;
    let j = Math.floor((80 * l) / 2447);
    let day = l - Math.floor((2447 * j) / 80);
    l = Math.floor(j / 11);
    let month = j + 2 - 12 * l;
    let year = 100 * (n - 49) + i + l;
    return new Date(year, month - 1, day);
  } else {
    let j = jd + 1402;
    let k = Math.floor((j - 1) / 1461);
    let l = j - 1461 * k;
    let n = Math.floor((l - 1) / 366);
    let m = l - 366 * n;
    if (n > 3) { n = 3; m = l - 366 * n; }
    let i = Math.floor((m + 31) / 31);
    let day = m - 31 * i + 31;
    let month = i + 1;
    let year = 4 * k + n - 4716;
    if (month > 12) { month -= 12; year += 1; }
    return new Date(year, month - 1, day);
  }
}

export const HIJRI_MONTHS = [
  "Muharrem", "Safer", "Rebiülevvel", "Rebiülahir", 
  "Cemaziyelevvel", "Cemaziyelahir", "Recep", "Şaban", 
  "Ramazan", "Şevval", "Zilkade", "Zilhicce"
];

export const GREGORIAN_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];
