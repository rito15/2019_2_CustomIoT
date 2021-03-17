import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetIpPage } from './set-ip.page';

describe('SetIpPage', () => {
  let component: SetIpPage;
  let fixture: ComponentFixture<SetIpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetIpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetIpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
