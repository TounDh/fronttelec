import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngpaymentComponent } from './mngpayment.component';

describe('MngpaymentComponent', () => {
  let component: MngpaymentComponent;
  let fixture: ComponentFixture<MngpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MngpaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MngpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
