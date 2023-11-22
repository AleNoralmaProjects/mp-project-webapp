import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfessionalComponent } from './manage-professional.component';

describe('ManageProfessionalComponent', () => {
  let component: ManageProfessionalComponent;
  let fixture: ComponentFixture<ManageProfessionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageProfessionalComponent]
    });
    fixture = TestBed.createComponent(ManageProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
