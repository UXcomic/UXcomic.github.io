import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionEmbedComponent } from './notion-embed-component'

describe('NotionEmbedComponent', () => {
  let component: NotionEmbedComponent
  let fixture: ComponentFixture<NotionEmbedComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionEmbedComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionEmbedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
