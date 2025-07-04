import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionTextComponent } from './notion-text-component';

describe('NotionTextComponent', () => {
  let component: NotionTextComponent;
  let fixture: ComponentFixture<NotionTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotionTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
