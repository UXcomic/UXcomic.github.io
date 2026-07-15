import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionHeading2Component } from './notion-heading-2-component'

describe('NotionHeading2Component', () => {
  let component: NotionHeading2Component
  let fixture: ComponentFixture<NotionHeading2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionHeading2Component],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionHeading2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
