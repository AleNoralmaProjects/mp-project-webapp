import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaisHomeComponent } from './eais-home.component';

describe('EaisHomeComponent', () => {
  let component: EaisHomeComponent;
  let fixture: ComponentFixture<EaisHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EaisHomeComponent]
    });
    fixture = TestBed.createComponent(EaisHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
