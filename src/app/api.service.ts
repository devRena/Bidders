import {Injectable} from "@angular/core";
 import {Http, Response} from "@angular/http";
 import {Observable} from "rxjs/Observable";
 import "rxjs/Rx";
 import {Bidder} from "./bidder";
 
 @Injectable()
 export class ApiService {
 
     private apiUrl = "http://private-anon-fdc7084775-biddermanagement.apiary-mock.com/bidders";
 
     constructor(private http: Http) {
     }
 
     getBidders(): Observable<Bidder[]> {
         return this.http
             .get(this.apiUrl)
             .map((response: Response) => {
                 return <Bidder[]>response.json();
             })
             .catch(this.handleError);
     }
 
     private handleError(error: Response) {
         return Observable.throw(error.statusText);
     }
 }