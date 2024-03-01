import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRoutesComponent } from './generate-routes.component';

describe('GenerateRoutesComponent', () => {
  let component: GenerateRoutesComponent;
  let fixture: ComponentFixture<GenerateRoutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateRoutesComponent]
    });
    fixture = TestBed.createComponent(GenerateRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
