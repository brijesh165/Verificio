import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectChangeModalComponent } from './approve-reject-change-modal.component';

describe('ApproveRejectChangeModalComponent', () => {
  let component: ApproveRejectChangeModalComponent;
  let fixture: ComponentFixture<ApproveRejectChangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectChangeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejectChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
