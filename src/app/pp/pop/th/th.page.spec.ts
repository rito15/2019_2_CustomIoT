import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThPage } from './th.page';

describe('ThPage', () => {
  let component: ThPage;
  let fixture: ComponentFixture<ThPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
