import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSection } from './tag-section';

describe('TagSection', () => {
  let component: TagSection;
  let fixture: ComponentFixture<TagSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
