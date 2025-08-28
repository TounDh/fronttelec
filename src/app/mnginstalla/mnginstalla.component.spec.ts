import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnginstallaComponent } from './mnginstalla.component';

describe('MnginstallaComponent', () => {
  let component: MnginstallaComponent;
  let fixture: ComponentFixture<MnginstallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MnginstallaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MnginstallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
