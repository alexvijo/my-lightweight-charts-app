import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BitcoinChartComponent } from './components/bitcoin-chart/bitcoin-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BitcoinChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-lightweight-charts-app';
}
