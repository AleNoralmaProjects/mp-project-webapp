import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfessionComponent } from './manage-profession.component';

describe('ManageProfessionComponent', () => {
  let component: ManageProfessionComponent;
  let fixture: ComponentFixture<ManageProfessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageProfessionComponent]
    });
    fixture = TestBed.createComponent(ManageProfessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
