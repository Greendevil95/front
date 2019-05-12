import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrgListComponent } from './my-org-list.component';

describe('MyOrgListComponent', () => {
  let component: MyOrgListComponent;
  let fixture: ComponentFixture<MyOrgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
