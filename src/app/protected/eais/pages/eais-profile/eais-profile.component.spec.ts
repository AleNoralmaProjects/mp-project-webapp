import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaisProfileComponent } from './eais-profile.component';

describe('EaisProfileComponent', () => {
  let component: EaisProfileComponent;
  let fixture: ComponentFixture<EaisProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EaisProfileComponent]
    });
    fixture = TestBed.createComponent(EaisProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
