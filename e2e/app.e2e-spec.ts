'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Bidderes';
const expectedTitle = `${expectedH1}`;
const targetBidder = { id: 15, name: 'Magneta' };
const targetBidderDashboardIndex = 3;
const nameSuffix = 'X';
const newBidderName = targetBidder.name + nameSuffix;

class Bidder {
  id: number;
  name: string;

  // Factory methods

  // Bidder from string formatted as '<id> <name>'.
  static fromString(s: string): Bidder {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Bidder from hero list <li> element.
  static async fromLi(li: ElementFinder): Promise<Bidder> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Bidder id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Bidder> {
    // Get hero id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topBidderes: element.all(by.css('app-root app-dashboard > div h4')),

      appBidderesHref: navElts.get(1),
      appBidderes: element(by.css('app-root app-heroes')),
      allBidderes: element.all(by.css('app-root app-heroes li')),
      selectedBidderSubview: element(by.css('app-root app-heroes > div:last-child')),

      heroDetail: element(by.css('app-root app-hero-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Bidderes'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top heroes', () => {
      let page = getPageElts();
      expect(page.topBidderes.count()).toEqual(4);
    });

    it(`selects and routes to ${targetBidder.name} details`, dashboardSelectTargetBidder);

    it(`updates hero name (${newBidderName}) in details view`, updateBidderNameInDetailView);

    it(`cancels and shows ${targetBidder.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetBidderElt = getPageElts().topBidderes.get(targetBidderDashboardIndex);
      expect(targetBidderElt.getText()).toEqual(targetBidder.name);
    });

    it(`selects and routes to ${targetBidder.name} details`, dashboardSelectTargetBidder);

    it(`updates hero name (${newBidderName}) in details view`, updateBidderNameInDetailView);

    it(`saves and shows ${newBidderName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetBidderElt = getPageElts().topBidderes.get(targetBidderDashboardIndex);
      expect(targetBidderElt.getText()).toEqual(newBidderName);
    });

  });

  describe('Bidderes tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Bidderes view', () => {
      getPageElts().appBidderesHref.click();
      let page = getPageElts();
      expect(page.appBidderes.isPresent()).toBeTruthy();
      expect(page.allBidderes.count()).toEqual(10, 'number of heroes');
    });

    it('can route to hero details', async () => {
      getBidderLiEltById(targetBidder.id).click();

      let page = getPageElts();
      expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
      let hero = await Bidder.fromDetail(page.heroDetail);
      expect(hero.id).toEqual(targetBidder.id);
      expect(hero.name).toEqual(targetBidder.name.toUpperCase());
    });

    it(`updates hero name (${newBidderName}) in details view`, updateBidderNameInDetailView);

    it(`shows ${newBidderName} in Bidderes list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetBidder.id} ${newBidderName}`;
      expect(getBidderAEltById(targetBidder.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newBidderName} from Bidderes list`, async () => {
      const heroesBefore = await toBidderArray(getPageElts().allBidderes);
      const li = getBidderLiEltById(targetBidder.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appBidderes.isPresent()).toBeTruthy();
      expect(page.allBidderes.count()).toEqual(9, 'number of heroes');
      const heroesAfter = await toBidderArray(page.allBidderes);
      // console.log(await Bidder.fromLi(page.allBidderes[0]));
      const expectedBidderes =  heroesBefore.filter(h => h.name !== newBidderName);
      expect(heroesAfter).toEqual(expectedBidderes);
      // expect(page.selectedBidderSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetBidder.name}`, async () => {
      const newBidderName = 'Alice';
      const heroesBefore = await toBidderArray(getPageElts().allBidderes);
      const numBidderes = heroesBefore.length;

      element(by.css('input')).sendKeys(newBidderName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let heroesAfter = await toBidderArray(page.allBidderes);
      expect(heroesAfter.length).toEqual(numBidderes + 1, 'number of heroes');

      expect(heroesAfter.slice(0, numBidderes)).toEqual(heroesBefore, 'Old heroes are still there');

      const maxId = heroesBefore[heroesBefore.length - 1].id;
      expect(heroesAfter[numBidderes]).toEqual({id: maxId + 1, name: newBidderName});
    });
  });

  describe('Progressive hero search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetBidder.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let hero = page.searchResults.get(0);
      expect(hero.getText()).toEqual(targetBidder.name);
    });

    it(`navigates to ${targetBidder.name} details view`, async () => {
      let hero = getPageElts().searchResults.get(0);
      expect(hero.getText()).toEqual(targetBidder.name);
      hero.click();

      let page = getPageElts();
      expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
      let hero2 = await Bidder.fromDetail(page.heroDetail);
      expect(hero2.id).toEqual(targetBidder.id);
      expect(hero2.name).toEqual(targetBidder.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetBidder() {
    let targetBidderElt = getPageElts().topBidderes.get(targetBidderDashboardIndex);
    expect(targetBidderElt.getText()).toEqual(targetBidder.name);
    targetBidderElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    let page = getPageElts();
    expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
    let hero = await Bidder.fromDetail(page.heroDetail);
    expect(hero.id).toEqual(targetBidder.id);
    expect(hero.name).toEqual(targetBidder.name.toUpperCase());
  }

  async function updateBidderNameInDetailView() {
    // Assumes that the current view is the hero details view.
    addToBidderName(nameSuffix);

    let page = getPageElts();
    let hero = await Bidder.fromDetail(page.heroDetail);
    expect(hero.id).toEqual(targetBidder.id);
    expect(hero.name).toEqual(newBidderName.toUpperCase());
  }

});

function addToBidderName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getBidderAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getBidderLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toBidderArray(allBidderes: ElementArrayFinder): Promise<Bidder[]> {
  let promisedBidderes = await allBidderes.map(Bidder.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedBidderes);
}
