import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { DashboardComponent }   from './dashboard/dashboard.component';
import { BiddersComponent }      from './bidders/bidders.component';
import { BidderDetailComponent }  from './bidder-detail/bidder-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/bidders', pathMatch: 'full' },
  { path: 'bidders', component: BiddersComponent },
  { path: 'detail/:id', component: BidderDetailComponent },
  { path: 'bidders', component: BiddersComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
