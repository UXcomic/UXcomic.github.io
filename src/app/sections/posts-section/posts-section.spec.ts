import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsSection } from './posts-section';

describe('PostsSection', () => {
  let component: PostsSection;
  let fixture: ComponentFixture<PostsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
