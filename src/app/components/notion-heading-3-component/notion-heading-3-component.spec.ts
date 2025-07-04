import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionHeading3Component } from './notion-heading-3-component';

describe('NotionHeading3Component', () => {
  let component: NotionHeading3Component;
  let fixture: ComponentFixture<NotionHeading3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionHeading3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotionHeading3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
