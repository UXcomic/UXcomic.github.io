import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionVideoComponent } from './notion-video-component'

describe('NotionVideoComponent', () => {
  let component: NotionVideoComponent
  let fixture: ComponentFixture<NotionVideoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionVideoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
