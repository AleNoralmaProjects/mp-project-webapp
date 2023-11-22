import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInfoeaisComponent } from './manage-infoeais.component';

describe('ManageInfoeaisComponent', () => {
  let component: ManageInfoeaisComponent;
  let fixture: ComponentFixture<ManageInfoeaisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageInfoeaisComponent]
    });
    fixture = TestBed.createComponent(ManageInfoeaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
