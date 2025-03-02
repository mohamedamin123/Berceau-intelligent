import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerceauComponent } from './berceau.component';

describe('BerceauComponent', () => {
  let component: BerceauComponent;
  let fixture: ComponentFixture<BerceauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BerceauComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BerceauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
