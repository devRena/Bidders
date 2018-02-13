import { Component } from '@angular/core';
import {BidderService} from "./bidder.service";
import { Bidder } from './bidder';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BidderService]
})
export class AppComponent {
  title = 'List of Bidders';
   
}
