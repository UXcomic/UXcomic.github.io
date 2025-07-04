import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostContentSection } from './post-content-section';

describe('PostContentSection', () => {
  let component: PostContentSection;
  let fixture: ComponentFixture<PostContentSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostContentSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostContentSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
