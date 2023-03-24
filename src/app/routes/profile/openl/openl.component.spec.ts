import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenlComponent } from './openl.component';

describe('OpenlComponent', () => {
  let component: OpenlComponent;
  let fixture: ComponentFixture<OpenlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
