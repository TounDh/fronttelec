import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngapplicComponent } from './mngapplic.component';

describe('MngapplicComponent', () => {
  let component: MngapplicComponent;
  let fixture: ComponentFixture<MngapplicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MngapplicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MngapplicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
