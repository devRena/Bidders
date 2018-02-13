import { Pipe, PipeTransform } from '@angular/core';  
import { Bidder } from './bidder';  
  
@Pipe({  
    name: 'BidderFilter',  
    pure: false  
})  
  
export class BidderFilter implements PipeTransform {  
    transform(items: any[], filter: Bidder): any {  
        if (!items || !filter) {  
            return items;  
        }  
        return items.filter(item => item.state.indexOf(filter.state) !== -1);  
    }  
} 