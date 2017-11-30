import { Component, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Router } from '@angular/router';

import { UserService } from '../../../service/user/user.service';
import { CommonService } from '../../../service/common/common.service';
import { DialogsService } from '../../../../component/dialog/dialogs.service';
import { ColumnEquipedService } from '../../../service/column-equiped/column-equiped.service';
import { environment } from '../../../../environments/environment';

import { DataSource } from '../../../classes/dataSource/dataSource';
import { ExportData } from '../../../classes/exportData/exportData';

@Component({
  selector: 'app-root',
  templateUrl: 'wa9001.component.html',
  styleUrls: ['wa9001.component.css']
})

export class sampleComponent implements AfterViewInit {
  private gridApi: any;
  public componentTitle = 'sample';
  public componentCd = `sample`;

  public gridOptions: GridOptions;
  public showGrid: boolean;

  public working = false;
  public height = 500;
  public production = environment.production;
  public backgroundColor: string;

  private dataSource: DataSource;
  public rowsPerPage = 10;
  public rowsPerPageModel = [
    { value: 10, viewValue: '10' },
    { value: 20, viewValue: '20' },
    { value: 50, viewValue: '50' },
    { value: 100, viewValue: '100' }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private commonService: CommonService,
    private dialogsService: DialogsService,
    private columnequipedService: ColumnEquipedService,
  ) {
    columnequipedService.saveCompoId(this.componentCd);
    const rows = localStorage.getItem('wa9001_rowsPerPage_idx');
    this.rowsPerPage = parseInt(rows, 10) || 10;
    this.dataSource = new DataSource({ parent: this, service: this.userService, resultKey: 'users' });
    this.gridOptions = <GridOptions>{
      enableFilter: true,
      enableRangeSelection: true,
      localeText: environment.gridLocale,
      getContextMenuItems: this.getContextMenuItems,
      pagination: true,
      rowModelType: 'infinite',
      paginationPageSize: this.rowsPerPage,
      enableServerSideSorting: true,
      enableServerSideFilter: true,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 2,
      maxBlocksInCache: 2,
      onColumnResized: columnequipedService.saveColumnWidth,
      // onColumnResized: this.saveColumnWidth,
      onColumnMoved: () => {
        this.saveColumnOrder();
      },
      onGridReady: params => {
        this.gridApi = params;
        const columns = [];
        for (const column of params.columnApi.getAllDisplayedColumns()) {
          const idx = localStorage.getItem(`wa9001_${column.getColId()}_idx`);
          columns.push({ idx: parseInt(idx, 10), column: column });
        }
        columns.sort((a, b) => {
          return a.idx - b.idx;
        });
        for (let i = columns.length - 1; i >= 0; i--) {
          const column = columns[i];
          params.columnApi.moveColumn(column.column, column.idx);
        }
      },
    };
    this.gridOptions.columnDefs = [
      {
        headerName: 'ユーザID',
        field: 'userId',
        width: this.getColumnWidth('userId', 200),
        hide: true,
      },
      {
        headerName: 'ユーザコード',
        field: 'userCd',
        sort: 'asc',
        width: this.getColumnWidth('userCd', 200)
      },
      {
        headerName: 'ユーザ名',
        field: 'userTx',
        width: this.getColumnWidth('userTx', 200)
      },
      {
        headerName: '論理倉庫',
        field: 'logicalWhTx',
        width: this.getColumnWidth('logicalWhTx', 200)
      },
      {
        headerName: '使用言語',
        field: 'langTx',
        width: this.getColumnWidth('langTx', 200)
      },
      {
        headerName: '権限',
        field: 'roleTx',
        width: this.getColumnWidth('roleTx', 200)
      },
      {
        headerName: '更新日時',
        field: 'updDt',
        width: this.getColumnWidth('updDt', 200),
        filter: 'date',
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            const dateAsString = cellValue;
            const dateParts = dateAsString.split('/');
            const cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
              return 0
            }
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        }
      },
      {
        headerName: '更新者名',
        field: 'upduserTx',
        width: this.getColumnWidth('upduserTx', 200),
        hide: true,
      },
      {
        headerName: '登録日時',
        field: 'addDt',
        width: this.getColumnWidth('addDt', 200),
        filter: 'date',
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            const dateAsString = cellValue;
            const dateParts = dateAsString.split('/');
            const cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
              return 0
            }
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        }
      },
      {
        headerName: '登録者名',
        field: 'adduserTx',
        width: this.getColumnWidth('adduserTx', 200),
        hide: true,
      },
    ];

    this.height = window.innerHeight - 80;
    if (this.production) {
      this.backgroundColor = 'primary';
    } else {
      this.backgroundColor = 'warn';
    }
  }

  // getColumnWidth(id: string, def: number): number {
  //   return parseInt(localStorage.getItem(`wa9001_${id}_width`), 10) || def;
  // }

  // saveColumnWidth(params) {
  //   if (params.finished === true && params.type === 'columnResized') {
  //     localStorage.setItem(`wa9001_${params.column.colId}_width`, params.column.actualWidth);
  //   }
  // }

  saveColumnOrder() {
    let idx = 0;
    for (const column of this.gridApi.columnApi.getAllDisplayedColumns()) {
      localStorage.setItem(`wa9001_${column.colId}_idx`, `${idx}`);
      idx++;
    }
  }

  paginatorRowChange() {
    this.gridOptions.api.paginationSetPageSize(this.rowsPerPage);
    localStorage.setItem('wa3010_rowsPerPage_idx', `${this.rowsPerPage}`);
  }

  getContextMenuItems(params) {
    const result = [
      'copy',
      'copyWithHeaders',
      'separator',
      {
        name: 'エクスポート',
        subMenu: [
          {
            name: 'CSVエクスポート',
            action: () => {
              ExportData.download(params.api.getDataAsCsv({ onlySelected: true }));
            }
          },
          {
            name: 'すべてCSVエクスポート',
            action: () => {
              ExportData.toCsv(params.api);
            }
          },
          'excelExport'
        ]
      }
    ];

    return result;
  }

  onResize(event) {
    this.height = event.target.innerHeight - 80;
  }

  ngAfterViewInit() {
    this.gridOptions.api.setDatasource(this.dataSource);
  }

  onSubmit() {
    this.gridOptions.api.setDatasource(this.dataSource);
  }

  reg() {
    this.router.navigate(['wa9002']);
  }

}
