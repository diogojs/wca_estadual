import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WCAAuthComponent } from './wca-auth.component';

describe('WCAAuthComponent', () => {
  let component: WCAAuthComponent;
  let fixture: ComponentFixture<WCAAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WCAAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WCAAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
