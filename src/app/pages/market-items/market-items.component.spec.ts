import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarketItemsComponent } from './market-items.component';

describe('MarketItemsComponent', () => {
  let component: MarketItemsComponent;
  let fixture: ComponentFixture<MarketItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
