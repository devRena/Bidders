import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const bidders = [
	{
    id: "e7fe51ce-4f63-7687-6353-ff0961c2eb0d",
    bidder: "Bidder 1",
    endpoint: "https://mybidder.com/bids",
    state: "CREATED"
  },
  {
    id: "d7f4f63e-c2cb-7687-c2cb-ff6353c2cb0e",
    bidder: "Bidder 2",
    endpoint: "https://test.bidder.com/bids",
    state: "LIVE"
  },
  {
    id: "ff0961c2-4f63-7687-6353-fd7f4f63eb0b",
    bidder: "Bidder 3",
    endpoint: "https://mybidrequest.my-example-bidder-endpoint.com",
    state: "LIVE"
  }
    ];
    return {bidders};
  }
}
