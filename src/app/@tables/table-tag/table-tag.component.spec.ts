import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTagComponent } from './table-tag.component';

describe('TableTagComponent', () => {
  let component: TableTagComponent;
  let fixture: ComponentFixture<TableTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
