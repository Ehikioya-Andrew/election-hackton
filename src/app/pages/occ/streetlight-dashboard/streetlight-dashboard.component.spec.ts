import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetlightDashboardComponent } from './streetlight-dashboard.component';

describe('StreetlightDashboardComponent', () => {
  let component: StreetlightDashboardComponent;
  let fixture: ComponentFixture<StreetlightDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreetlightDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreetlightDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
