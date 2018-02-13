import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Bidder } from './bidder';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BidderService {

  private biddersUrl = 'api/bidders';  // URL to web api
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET bidders from the server */
  getBidders (): Observable<Bidder[]> {
    return this.http.get<Bidder[]>(this.biddersUrl)
      .pipe(
        tap(bidders => this.log(`fetched bidders`)),
        catchError(this.handleError('getBidders', []))
      );
  }

  /** GET bidder by id. Return `undefined` when id not found */
  getBidderNo404<Data>(id: number): Observable<Bidder> {
    const url = `${this.biddersUrl}/?id=${id}`;
    return this.http.get<Bidder[]>(url)
      .pipe(
        map(bidders => bidders[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} bidder id=${id}`);
        }),
        catchError(this.handleError<Bidder>(`getBidder id=${id}`))
      );
  }

  /** GET bidder by id. Will 404 if id not found */
  getBidder(id: string): Observable<Bidder> {
    const url = `${this.biddersUrl}/${id}`;
    return this.http.get<Bidder>(url).pipe(
      tap(_ => this.log(`fetched bidder id=${id}`)),
      catchError(this.handleError<Bidder>(`getBidder id=${id}`))
    );
  }

  /* GET bidders whose bidder contains search term */
  searchBidders(term: string): Observable<Bidder[]> {
    if (!term.trim()) {
      // if not search term, return empty bidder array.
      return of([]);
    }
    return this.http.get<Bidder[]>(`api/bidders/?bidder=${term}`).pipe(
      tap(_ => this.log(`found bidders matching "${term}"`)),
      catchError(this.handleError<Bidder[]>('searchBidders', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new bidder to the server */
  addBidder (bidder: Bidder): Observable<Bidder> {
    return this.http.post<Bidder>(this.biddersUrl, bidder, httpOptions).pipe(
      tap((bidder: Bidder) => this.log(`added bidder w/ id=${bidder.id}`)),
      catchError(this.handleError<Bidder>('addBidder'))
    );
  }


  /** PUT: update the bidder on the server */
  updateBidder (bidder: Bidder): Observable<any> {
    return this.http.put(this.biddersUrl, bidder, httpOptions).pipe(
      tap(_ => this.log(`updated bidder id=${bidder.id}`)),
      catchError(this.handleError<any>('updateBidder'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - bidder of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a BidderService message with the MessageService */
  private log(message: string) {
    this.messageService.add('BidderService: ' + message);
  }
}
