import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrigadaEaisComponent } from './brigada-eais.component';

describe('BrigadaEaisComponent', () => {
  let component: BrigadaEaisComponent;
  let fixture: ComponentFixture<BrigadaEaisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrigadaEaisComponent]
    });
    fixture = TestBed.createComponent(BrigadaEaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
