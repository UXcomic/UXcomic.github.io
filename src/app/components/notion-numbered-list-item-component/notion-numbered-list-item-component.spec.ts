import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionNumberedListItemComponent } from './notion-numbered-list-item-component';

describe('NotionNumberedListItemComponent', () => {
  let component: NotionNumberedListItemComponent;
  let fixture: ComponentFixture<NotionNumberedListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionNumberedListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotionNumberedListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
