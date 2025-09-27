import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCharacter } from './new-character';

describe('NewCharacter', () => {
  let component: NewCharacter;
  let fixture: ComponentFixture<NewCharacter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCharacter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCharacter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
