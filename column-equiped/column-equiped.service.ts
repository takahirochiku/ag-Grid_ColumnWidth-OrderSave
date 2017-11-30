import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ColumnEquipedService {

  componentCd: string;

  constructor() { }

  saveCompoId(compId: string) {
    this.componentCd = compId;
    console.log(`saveCompoId.componentCd:`, this.componentCd);
  }

  saveColumnWidth(params) {
    console.log(`saveColumnWidth.componentCd:`, this.componentCd);
    console.log(`params:`, params);
    console.log(`params.finished:`, params.finished);
    console.log(`params.type:`, params.type);

    if (params.finished === true && params.type === 'columnResized') {
      localStorage.setItem(`${this.componentCd}_${params.column.colId}_width`, params.column.actualWidth);
    }

  }

  getColumnWidth(id: string, def: number): number {

    console.log(id, 'getColumnWidth');

    return parseInt(localStorage.getItem(`${this.componentCd}_${id}_width`), 10) || def;
  }

}

