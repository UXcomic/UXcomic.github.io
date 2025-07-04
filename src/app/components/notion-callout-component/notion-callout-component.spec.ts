import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotionCalloutComponent } from './notion-callout-component';

describe('NotionCalloutComponent', () => {
  let component: NotionCalloutComponent;
  let fixture: ComponentFixture<NotionCalloutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotionCalloutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotionCalloutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
