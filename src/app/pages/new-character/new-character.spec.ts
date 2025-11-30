import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // <-- Added this import
import { NewCharacterComponent } from './new-character';

describe('NewCharacter', () => {
  let component: NewCharacterComponent;
  let fixture: ComponentFixture<NewCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCharacterComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: { queryParams: of({}) } }], // <-- Updated useValue
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
