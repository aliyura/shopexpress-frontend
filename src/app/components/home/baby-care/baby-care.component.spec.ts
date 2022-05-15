import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BabyCareComponent } from './baby-care.component';

describe('BabyCareComponent', () => {
  let component: BabyCareComponent;
  let fixture: ComponentFixture<BabyCareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BabyCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
