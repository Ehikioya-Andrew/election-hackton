import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutageAnalyticsComponent } from './outage-analytics.component';


describe('LoadPointAnalyticsComponent', () => {
  let component: OutageAnalyticsComponent;
  let fixture: ComponentFixture<OutageAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutageAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
