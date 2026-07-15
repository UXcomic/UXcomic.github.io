import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PostContentDetailSection } from './post-content-detail-section'

describe('PostContentDetailSection', () => {
  let component: PostContentDetailSection
  let fixture: ComponentFixture<PostContentDetailSection>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostContentDetailSection],
    }).compileComponents()

    fixture = TestBed.createComponent(PostContentDetailSection)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
