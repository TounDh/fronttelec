import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngserviceComponent } from './mngservice.component';

describe('MngserviceComponent', () => {
  let component: MngserviceComponent;
  let fixture: ComponentFixture<MngserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MngserviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MngserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
