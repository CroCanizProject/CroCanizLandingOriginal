import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessGeneralComponent } from './process-general.component';

describe('ProcessGeneralComponent', () => {
  let component: ProcessGeneralComponent;
  let fixture: ComponentFixture<ProcessGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
