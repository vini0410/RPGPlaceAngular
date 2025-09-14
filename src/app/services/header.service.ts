import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private tableNameSubject = new BehaviorSubject<string | null>(null);
  tableName$ = this.tableNameSubject.asObservable();

  setTableName(name: string | null): void {
    this.tableNameSubject.next(name);
  }
}
