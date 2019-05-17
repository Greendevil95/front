import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptStatusComponent } from './accept-status.component';

describe('AcceptStatusComponent', () => {
  let component: AcceptStatusComponent;
  let fixture: ComponentFixture<AcceptStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
