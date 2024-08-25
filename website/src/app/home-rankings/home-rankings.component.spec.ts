import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRankingsComponent } from './home-rankings.component';

describe('HomeRankingsComponent', () => {
  let component: HomeRankingsComponent;
  let fixture: ComponentFixture<HomeRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRankingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
