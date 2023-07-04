import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemRemoveDialogComponent } from './cart-item-remove-dialog.component';

describe('CartItemRemoveDialogComponent', () => {
  let component: CartItemRemoveDialogComponent;
  let fixture: ComponentFixture<CartItemRemoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartItemRemoveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemRemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
