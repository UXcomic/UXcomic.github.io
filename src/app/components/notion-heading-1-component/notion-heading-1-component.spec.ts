import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionHeading1Component } from './notion-heading-1-component';

describe('NotionHeading1Component', () => {
  let component: NotionHeading1Component;
  let fixture: ComponentFixture<NotionHeading1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionHeading1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotionHeading1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
