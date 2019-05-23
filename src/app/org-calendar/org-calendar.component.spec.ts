import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgCalendarComponent } from './org-calendar.component';

describe('OrgCalendarComponent', () => {
  let component: OrgCalendarComponent;
  let fixture: ComponentFixture<OrgCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
