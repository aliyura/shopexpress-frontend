import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RatingViewComponent } from './rating-view.component';

describe('RatingViewComponent', () => {
  let component: RatingViewComponent;
  let fixture: ComponentFixture<RatingViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
