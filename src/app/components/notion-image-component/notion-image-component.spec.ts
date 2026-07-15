import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionImageComponent } from './notion-image-component'

describe('NotionImageComponent', () => {
  let component: NotionImageComponent
  let fixture: ComponentFixture<NotionImageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionImageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionImageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
