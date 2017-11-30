import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Wa9001Component } from './wa9001.component';

describe('Wa9001Component', () => {
  let component: Wa9001Component;
  let fixture: ComponentFixture<Wa9001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Wa9001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Wa9001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
