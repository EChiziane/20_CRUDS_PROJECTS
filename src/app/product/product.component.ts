import {Component, OnInit} from '@angular/core';
import {Product} from '../models/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../services/product.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  productList: Product[] = [];
  searchValue = '';
  isDrawerVisible = false;
  currentEditingProductId: string | null = null;

  productForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentEditingProductId ? 'Edit Product' : 'Create Product';
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentEditingProductId = null;
    this.productForm.reset();
  }

  submitProduct(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      if (this.currentEditingProductId) {
        this.productService.updateProduct(this.currentEditingProductId, productData).subscribe({
          next: () => {
            this.loadProducts();
            this.closeDrawer();
            this.message.success('Product updated successfully ✅');
          },
          error: () => this.message.error('Error updating product 🚫')
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.loadProducts();
            this.closeDrawer();
            this.message.success('Product created successfully ✅');
          },
          error: () => this.message.error('Error creating product 🚫')
        });
      }
    }
  }

  deleteProduct(product: Product): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this product?',
      nzContent: `Product: <strong>${product.name}</strong>`,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.loadProducts();
            this.message.success('Product deleted successfully 🗑️');
          },
          error: () => this.message.error('Error deleting product 🚫')
        });
      }
    });
  }

  editProduct(product: Product): void {
    this.currentEditingProductId = product.id;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category
    });

    this.isDrawerVisible = true;
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.productForm.reset();
    this.currentEditingProductId = null;
  }

  search(): void {
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadProducts();
      return;
    }
    this.productList = this.productList.filter(product =>
      product.name.toLowerCase().includes(val) ||
      product.description.toLowerCase().includes(val) ||
      product.category.toLowerCase().includes(val)
    );
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.productList = products;
    });
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }
}
