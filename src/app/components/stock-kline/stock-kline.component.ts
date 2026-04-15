import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi
} from 'lightweight-charts';
import { StockChartService } from '../../services/stock-chart.service';

@Component({
  selector: 'app-stock-kline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-kline.component.html',
  styleUrls: ['./stock-kline.component.css']
})
export class StockKlineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartHost', { static: true }) chartHost!: ElementRef<HTMLDivElement>;

  private chart: IChartApi | null = null;

  constructor(private stockChart: StockChartService) {}

  ngAfterViewInit(): void {
    const el = this.chartHost.nativeElement;
    this.chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1d24' },
        textColor: '#d1d4dc'
      },
      grid: {
        vertLines: { color: '#2b2f36' },
        horzLines: { color: '#2b2f36' }
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#2b2f36' },
      timeScale: { borderColor: '#2b2f36', timeVisible: true, secondsVisible: false },
      autoSize: true
    });

    const series = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });

    const bars = this.stockChart.generateDemoDailyCandles(120);
    series.setData(this.stockChart.toLightweightCandles(bars));
    this.chart.timeScale().fitContent();
  }

  ngOnDestroy(): void {
    this.chart?.remove();
    this.chart = null;
  }
}
