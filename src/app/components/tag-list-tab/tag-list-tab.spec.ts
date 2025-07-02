import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListTab } from './tag-list-tab';

describe('TagListTab', () => {
  let component: TagListTab;
  let fixture: ComponentFixture<TagListTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagListTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagListTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
