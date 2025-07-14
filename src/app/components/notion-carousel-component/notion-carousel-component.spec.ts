import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionCarouselComponent } from './notion-carousel-component'

describe('NotionCarouselComponent', () => {
  let component: NotionCarouselComponent
  let fixture: ComponentFixture<NotionCarouselComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionCarouselComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionCarouselComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
