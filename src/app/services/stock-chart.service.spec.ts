import { TestBed } from '@angular/core/testing';
import { StockChartService } from './stock-chart.service';

describe('StockChartService', () => {
  let service: StockChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockChartService);
  });

  it('should generate deterministic OHLC bars', () => {
    const a = service.generateDemoDailyCandles(10, 7);
    const b = service.generateDemoDailyCandles(10, 7);
    expect(a.length).toBe(10);
    expect(a[0].close).toBe(b[0].close);
  });

  it('should map to lightweight-charts candle format', () => {
    const lw = service.toLightweightCandles([
      { time: 1700000000, open: 1, high: 2, low: 0.5, close: 1.5 }
    ]);
    expect(lw[0].time).toBe(1700000000);
    expect(lw[0].open).toBe(1);
  });
});
