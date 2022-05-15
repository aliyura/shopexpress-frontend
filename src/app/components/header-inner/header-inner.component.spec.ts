import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderInnerComponent } from './header-inner.component';

describe('HeaderInnerComponent', () => {
  let component: HeaderInnerComponent;
  let fixture: ComponentFixture<HeaderInnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
