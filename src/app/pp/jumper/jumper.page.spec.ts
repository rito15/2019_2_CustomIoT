import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JumperPage } from './jumper.page';

describe('JumperPage', () => {
  let component: JumperPage;
  let fixture: ComponentFixture<JumperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumperPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
