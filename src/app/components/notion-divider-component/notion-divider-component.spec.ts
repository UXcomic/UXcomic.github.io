import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionDividerComponent } from './notion-divider-component'

describe('NotionDividerComponent', () => {
  let component: NotionDividerComponent
  let fixture: ComponentFixture<NotionDividerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionDividerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionDividerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
