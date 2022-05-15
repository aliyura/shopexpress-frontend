import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecentViewedComponent } from './recent-viewed.component';

describe('RecentViewedComponent', () => {
  let component: RecentViewedComponent;
  let fixture: ComponentFixture<RecentViewedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentViewedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentViewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
