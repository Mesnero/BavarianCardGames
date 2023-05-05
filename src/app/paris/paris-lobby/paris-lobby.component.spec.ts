import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParisLobbyComponent } from './paris-lobby.component';

describe('ParisLobbyComponent', () => {
  let component: ParisLobbyComponent;
  let fixture: ComponentFixture<ParisLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParisLobbyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParisLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
