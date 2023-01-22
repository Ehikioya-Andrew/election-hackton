import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutageBlockComponent } from './outage-block.component';

describe('OutageBlockComponent', () => {
  let component: OutageBlockComponent;
  let fixture: ComponentFixture<OutageBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutageBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutageBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
