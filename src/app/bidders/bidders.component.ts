import { Component, OnInit } from '@angular/core';
import { Bidder } from '../bidder';
import { BidderService } from '../bidder.service';
import {BidderFilter} from '../BidderFilter';  
@Component({
  selector: 'app-bidders',
  templateUrl: './bidders.component.html',
  styleUrls: ['./bidders.component.css']
})
export class BiddersComponent implements OnInit {
	
  bidders: Bidder[];
filterargs = {state: 'CREATED'};
filterargs2 = {state: 'LIVE'};
  constructor(private bidderService: BidderService) { }

  ngOnInit() {
    this.getBidders();
  }

  getBidders(): void {
    this.bidderService.getBidders()
    .subscribe(bidders => this.bidders = bidders);
  }

  add(bidder: string): void {
    bidder = bidder.trim();
    if (!bidder) { return; }
    this.bidderService.addBidder({ bidder } as Bidder)
      .subscribe(bidder => {
        this.bidders.push(bidder);
      });
  }

}
