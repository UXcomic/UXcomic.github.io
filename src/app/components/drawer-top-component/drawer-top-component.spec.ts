import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DrawerTopComponent } from './drawer-top-component'

describe('DrawerTopComponent', () => {
  let component: DrawerTopComponent
  let fixture: ComponentFixture<DrawerTopComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerTopComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DrawerTopComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
