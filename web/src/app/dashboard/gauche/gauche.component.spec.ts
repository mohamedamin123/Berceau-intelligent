import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaucheComponent } from './gauche.component';

describe('GaucheComponent', () => {
  let component: GaucheComponent;
  let fixture: ComponentFixture<GaucheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaucheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaucheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
