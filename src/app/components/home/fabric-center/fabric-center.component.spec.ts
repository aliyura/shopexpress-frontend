import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FabricCenterComponent } from './fabric-center.component';

describe('FabricCenterComponent', () => {
  let component: FabricCenterComponent;
  let fixture: ComponentFixture<FabricCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
