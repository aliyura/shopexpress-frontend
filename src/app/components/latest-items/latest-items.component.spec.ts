import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LatestItemsComponent } from './latest-items.component';

describe('LatestItemsComponent', () => {
  let component: LatestItemsComponent;
  let fixture: ComponentFixture<LatestItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
