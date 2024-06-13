import { Component, ElementRef, ViewChild } from '@angular/core';
import { IChartApi, createChart } from 'lightweight-charts';
import { BitcoinService } from '../../services/bitcoin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bitcoin-chart',
  standalone: true,
  imports: [],
  templateUrl: './bitcoin-chart.component.html',
  styleUrl: './bitcoin-chart.component.css'
})
export class BitcoinChartComponent {

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private chart!: IChartApi;
  private intervalId: any;
  private dataSubscription!: Subscription;

  constructor(private bitcoinService: BitcoinService) {}

  ngAfterViewInit(): void {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 400,
      layout: {
          background: { color: '#222' },
          textColor: '#DDD',
      },
      grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
      },
      timeScale: {
        borderColor: '#cccccc'
      }
    });

    const lineSeries = this.chart.addLineSeries({
      color: 'rgb(255, 165, 0)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: this.priceFormatter
      }
    });

    this.fetchData(lineSeries);

    this.intervalId = setInterval(() => {
      this.fetchData(lineSeries);
    }, 60 * 60 * 1000); // Actualizar cada minuto
  }

  priceFormatter(price: number): string {
    return price >= 1000 ? `${(price / 1000).toFixed(1)}k` : price.toFixed(2);
  }

  fetchData(lineSeries: any): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = this.bitcoinService.getBitcoinPrices().subscribe(data => {
      const prices = data.prices.map((price: any) => {
        return { time: price[0] / 1000, value: price[1] };
      });

      lineSeries.setData(prices);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
