import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesEaisComponent } from './routes-eais.component';

describe('RoutesEaisComponent', () => {
  let component: RoutesEaisComponent;
  let fixture: ComponentFixture<RoutesEaisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoutesEaisComponent]
    });
    fixture = TestBed.createComponent(RoutesEaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
