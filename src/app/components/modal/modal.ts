import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<string>();

  tableCode = '';

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    this.submitModal.emit(this.tableCode);
  }
}
