import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Bidder } from '../bidder';
import { BidderService } from '../bidder.service';

@Component({
  selector: 'app-bidder-search',
  templateUrl: './bidder-search.component.html',
  styleUrls: [ './bidder-search.component.css' ]
})
export class BidderSearchComponent implements OnInit {
  bidders$: Observable<Bidder[]>;
  private searchTerms = new Subject<string>();

  constructor(private bidderService: BidderService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.bidders$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.bidderService.searchBidders(term)),
    );
  }
}
