import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterruptPage } from './interrupt.page';

describe('InterruptPage', () => {
  let component: InterruptPage;
  let fixture: ComponentFixture<InterruptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterruptPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterruptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
