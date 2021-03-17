import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AndOrPage } from './and-or.page';

describe('AndOrPage', () => {
  let component: AndOrPage;
  let fixture: ComponentFixture<AndOrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AndOrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AndOrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
