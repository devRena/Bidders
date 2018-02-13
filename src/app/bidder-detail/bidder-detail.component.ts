import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Bidder }         from '../bidder';
import { BidderService }  from '../bidder.service';

@Component({
  selector: 'app-bidder-detail',
  templateUrl: './bidder-detail.component.html',
  styleUrls: [ './bidder-detail.component.css' ]
})
export class BidderDetailComponent implements OnInit {
  @Input() bidder: Bidder;


  constructor(
    private route: ActivatedRoute,
    private bidderService: BidderService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getBidder();
  }

  getBidder(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bidderService.getBidder(id)
      .subscribe(bidder => this.bidder = bidder);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.bidderService.updateBidder(this.bidder)
      .subscribe(() => this.goBack());
  }
}
