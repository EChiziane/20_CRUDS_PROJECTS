import {Component, OnInit} from '@angular/core';
import {Book} from '../models/book';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BookService} from '../services/book.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-book',
  standalone: false,
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss'
})

export class BookComponent implements OnInit {
  listOfBooks: Book[] = [];
  searchValue = '';
  isDrawerVisible = false;
  currentEditingBookId: string | null = null;
  bookForm!: FormGroup;

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  get drawerTitle(): string {
    return this.currentEditingBookId ? 'Edit Book' : 'Create Book';
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publisher: ['', Validators.required],
      publicationYear: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      isbn: ['', Validators.required],
    });
  }

  private loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.listOfBooks = books;
    });
  }

  openDrawer(): void {
    this.isDrawerVisible = true;
    this.currentEditingBookId = null;
    this.bookForm.reset();
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.bookForm.reset();
    this.currentEditingBookId = null;
  }

  submitBook(): void {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;

      if (this.currentEditingBookId) {
        this.bookService.updateBook(this.currentEditingBookId, bookData).subscribe({
          next: () => {
            this.loadBooks();
            this.closeDrawer();
            this.message.success('Book updated successfully ✅');
          },
          error: () => this.message.error('Failed to update book ❌')
        });
      } else {
        this.bookService.addBook(bookData).subscribe({
          next: () => {
            this.loadBooks();
            this.closeDrawer();
            this.message.success('Book created successfully 📚');
          },
          error: () => this.message.error('Failed to create book ❌')
        });
      }
    }
  }

  editBook(book: Book): void {
    this.currentEditingBookId = book.id;
    this.bookForm.patchValue(book);
    this.isDrawerVisible = true;
  }

  deleteBook(book: Book): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this book?',
      nzContent: `Book: <strong>${book.title}</strong>`,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => {
        this.bookService.deleteBook(book.id).subscribe({
          next: () => {
            this.loadBooks();
            this.message.success('Book deleted successfully 🗑️');
          },
          error: () => this.message.error('Failed to delete book ❌')
        });
      }
    });
  }

  search(): void {
    const val = this.searchValue.toLowerCase();
    if (!val) {
      this.loadBooks();
      return;
    }
    this.listOfBooks = this.listOfBooks.filter(book =>
      book.title.toLowerCase().includes(val) ||
      book.author.toLowerCase().includes(val) ||
      book.isbn.toLowerCase().includes(val)
    );
  }
}
