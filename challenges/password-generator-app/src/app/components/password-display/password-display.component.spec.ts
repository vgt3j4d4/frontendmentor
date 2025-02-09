import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordDisplayComponent } from './password-display.component';

describe('PasswordDisplayComponent', () => {
  let component: PasswordDisplayComponent;
  let fixture: ComponentFixture<PasswordDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
