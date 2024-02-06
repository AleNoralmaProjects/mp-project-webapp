import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaisInformationComponent } from './eais-information.component';

describe('EaisInformationComponent', () => {
  let component: EaisInformationComponent;
  let fixture: ComponentFixture<EaisInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EaisInformationComponent]
    });
    fixture = TestBed.createComponent(EaisInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
