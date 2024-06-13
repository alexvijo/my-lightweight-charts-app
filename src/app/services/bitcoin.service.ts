import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BitcoinService {

  private apiUrl = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';

  constructor(private http: HttpClient) { }

  getBitcoinPrices(): Observable<any> {
    const now = Math.floor(Date.now() / 1000);
    // a year ago
    const oneYearAgo = now - 365 * 24 * 60 * 60;
    //const oneDayAgo = now - 24 * 60 * 60;
    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('days', '365')
      .set('from', oneYearAgo.toString())
      .set('to', now.toString());

    return this.http.get(`${this.apiUrl}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red.
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // El backend devolvió un código de respuesta no exitoso.
      console.error(
        `Backend devolvió el código ${error.status}, ` +
        `cuerpo fue: ${error.error}`);
    }
    // Retorna un observable con un mensaje de error apto para el usuario.
    return throwError(
      'Algo malo pasó; por favor, intenta de nuevo más tarde.');
  }
}
