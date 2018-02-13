import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { HttpClientModule }    from '@angular/common/http';
import { NgbModule }       from '@ng-bootstrap/ng-bootstrap';
import {BidderFilter} from './BidderFilter';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
//import { DashboardComponent }   from './dashboard/dashboard.component';
import { BidderDetailComponent }  from './bidder-detail/bidder-detail.component';
import { BiddersComponent }      from './bidders/bidders.component';
import { BidderSearchComponent }  from './bidder-search/bidder-search.component';
import { BidderService }          from './bidder.service';
import { MessageService }       from './message.service';
import { MessagesComponent }    from './messages/messages.component'; 

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
	NgbModule,
    AppRoutingModule,
    HttpClientModule,
	HttpModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AppComponent,
	BidderFilter,
//    DashboardComponent,
    BiddersComponent,
    BidderDetailComponent,
    MessagesComponent,
    BidderSearchComponent
  ],
  providers: [ AppComponent,BidderService, MessageService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
