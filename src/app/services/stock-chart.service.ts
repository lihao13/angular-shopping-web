import { Injectable } from '@angular/core';
import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
import { OhlcBar } from '../models/ohlc';

/** 可复现的伪随机（用于演示数据） */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

@Injectable({ providedIn: 'root' })
export class StockChartService {
  /**
   * 生成模拟日 K 数据（UTC 日对齐，仅作前端展示）。
   * @param barCount 根数
   * @param seed 随机种子，换种子换走势
   */
  generateDemoDailyCandles(barCount: number, seed = 42): OhlcBar[] {
    const rand = mulberry32(seed);
    const bars: OhlcBar[] = [];
    let price = 50 + rand() * 20;
    const startSec = Math.floor(Date.UTC(2026, 0, 2) / 1000);

    for (let i = 0; i < barCount; i++) {
      const drift = (rand() - 0.48) * 1.2;
      const open = price;
      const close = Math.max(0.01, price + drift);
      const range = rand() * 1.8 + 0.2;
      const high = Math.max(open, close) + rand() * range;
      const low = Math.min(open, close) - rand() * range;
      bars.push({
        time: startSec + i * 86400,
        open,
        high,
        low,
        close
      });
      price = close;
    }

    return bars;
  }

  toLightweightCandles(bars: OhlcBar[]): CandlestickData<UTCTimestamp>[] {
    return bars.map((b) => ({
      time: b.time as UTCTimestamp,
      open: b.open,
      high: b.high,
      low: b.low,
      close: b.close
    }));
  }
}
