import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListDialog } from './category-list-dialog';

describe('CategoryListDialog', () => {
  let component: CategoryListDialog;
  let fixture: ComponentFixture<CategoryListDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
