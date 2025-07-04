import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionParagraphComponent } from './notion-paragraph-component';

describe('NotionParagraphComponent', () => {
  let component: NotionParagraphComponent;
  let fixture: ComponentFixture<NotionParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionParagraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotionParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
