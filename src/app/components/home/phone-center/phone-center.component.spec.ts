import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhoneCenterComponent } from './phone-center.component';

describe('PhoneCenterComponent', () => {
  let component: PhoneCenterComponent;
  let fixture: ComponentFixture<PhoneCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
