import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopCategoryComponent } from './top-category.component';

describe('TopCategoryComponent', () => {
  let component: TopCategoryComponent;
  let fixture: ComponentFixture<TopCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
