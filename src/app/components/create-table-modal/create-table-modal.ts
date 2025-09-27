import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-table-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-table-modal.html',
  styleUrls: ['./create-table-modal.css']
})
export class CreateTableModal {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<{ tableName: string; rulebookName: string }>();

  tableName = '';
  rulebookName = '';

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    this.submitModal.emit({ tableName: this.tableName, rulebookName: this.rulebookName });
  }
}
