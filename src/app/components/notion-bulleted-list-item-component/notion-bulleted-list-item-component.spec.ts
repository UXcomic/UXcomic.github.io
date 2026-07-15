import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NotionBulletedListItemComponent } from './notion-bulleted-list-item-component'

describe('NotionBulletedListItemComponent', () => {
  let component: NotionBulletedListItemComponent
  let fixture: ComponentFixture<NotionBulletedListItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionBulletedListItemComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NotionBulletedListItemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
