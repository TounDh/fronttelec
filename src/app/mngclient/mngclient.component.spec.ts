import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngclientComponent } from './mngclient.component';

describe('MngclientComponent', () => {
  let component: MngclientComponent;
  let fixture: ComponentFixture<MngclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MngclientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MngclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
