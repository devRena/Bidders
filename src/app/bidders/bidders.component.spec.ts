import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddersComponent } from './bidders.component';

describe('BiddersComponent', () => {
  let component: BiddersComponent;
  let fixture: ComponentFixture<BiddersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiddersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiddersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
