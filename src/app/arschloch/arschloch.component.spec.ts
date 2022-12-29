import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArschlochComponent } from './arschloch.component';

describe('ArschlochComponent', () => {
  let component: ArschlochComponent;
  let fixture: ComponentFixture<ArschlochComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArschlochComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArschlochComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
