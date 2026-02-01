import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecordDialog } from './create-record-dialog';

describe('CreateRecordDialog', () => {
  let component: CreateRecordDialog;
  let fixture: ComponentFixture<CreateRecordDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecordDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecordDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
