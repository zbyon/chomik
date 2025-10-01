/*
 * Copyright (C) 2025 Piecuuu

 * This file is part of Chomik.
 * Chomik is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * Chomik is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Chomik. If not, see <https://www.gnu.org/licenses/>. 
 */

export class Format {
  public static formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bajtów'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  public static secondsToWHMS(seconds: number): string {
    const intervals: IntervalTable[] = [
      { singular: "tydzień", plural: "tygodni", sec: 60*60*24*7 },
      { singular: "dzień", plural: "dni", sec: 60*60*24 },
      { singular: "godzina", plural: "godzin", sec: 60*60 },
      { singular: "minuta", plural: "minut", sec: 60 },
      { singular: "sekunda", plural: "sekund", sec: 1 },
    ]
    interface IntervalTable {
      singular: string;
      plural: string;
      sec: number;
    }

    const parts: { label: string, count: number }[] = [];

    intervals.forEach(interval => {
      const count = Math.floor(seconds / interval.sec);
      if      (count >  1) parts.push({ label: interval.plural, count });
      else if (count == 1) parts.push({ label: interval.singular, count });
      
      seconds -= count * interval.sec;
    });

    const result = parts.map(p => `${p.count} ${p.label}`).join(", ");
    if(result.length > 100) throw new Error("Time too long (what the fuck?)")

    return result;
  }

  public static convertWHMSToMillis(timeString: string): number {
    type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w';
    const multipliers: Record<TimeUnit, number> = {
      ms: 1,
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
      w: 604_800_000,
    };

    if (typeof timeString !== 'string' || !timeString.trim()) {
      throw new Error('Input must be a non-empty string.');
    }

    const regex = /(\d+)\s*([a-zA-Z]+)/g;
    let total = 0;
    let found = false;

    for (const match of timeString.matchAll(regex)) {
      found = true;
      const value = Number(match[1]);
      const unit = match[2]!.toLowerCase() as TimeUnit;

      if (!(unit in multipliers)) {
        throw new Error(`Invalid time unit: ${unit}`);
      }
      total += value * multipliers[unit];
    }

    if (!found || total <= 0) {
      throw new Error('Time duration must be a positive value with valid units.');
    }

    return total;
  }
}