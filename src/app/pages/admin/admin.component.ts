import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [MessageService]
})
export class AdminComponent implements OnInit {
  data: any[] = [];
  paginatedData: any[] = [];
  totalRecords: number = 0;
  isAdmin: boolean = false;
  selectedItem: any = null;
  displayEditDialog: boolean = false;
  displayCreateDialog: boolean = false;
  searchQuery: string = '';
  loading: boolean = false; 
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private apiService: ApiService, 
    private messageService: MessageService,
    private authService: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.list().subscribe((data) => {
      this.data = data;
      this.totalRecords = data.length;
      this.paginateData();
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  paginateData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.data.slice(start, end);
  }

  save() {
    this.loading = true;
    const index = this.data.findIndex(item => item.id === this.selectedItem.id);
    if (index !== -1) {
      this.apiService.edit(this.selectedItem.id, this.selectedItem).subscribe(
        (data) => {
          this.data[index] = data;
          this.paginateData();
          this.displayEditDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item editado exitosamente' });
          this.loading = false;
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al editar el item' });
          this.loading = false;
        }
      );
    }
  }

  create() {
    this.loading = true;
    this.apiService.create(this.selectedItem).subscribe(
      (data) => {
        this.data.push(data);
        this.totalRecords = this.data.length;
        this.paginateData();
        this.displayCreateDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item creado exitosamente' });
        this.loading = false;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el item' });
        this.loading = false;
      }
    );
  }

  edit(rowData: any) {
    this.selectedItem = { ...rowData };
    this.displayEditDialog = true;
  }

  delete(rowData: any) {
    this.loading = true;
    this.apiService.delete(rowData.id).subscribe(
      () => {
        this.data = this.data.filter(item => item.id !== rowData.id);
        this.totalRecords = this.data.length;
        this.paginateData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item eliminado exitosamente' });
        this.loading = false;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el item' });
        this.loading = false;
      }
    );
  }

  filterData() {
    this.loading = true;
    if (this.searchQuery) {
      const filteredData = this.data.filter(item => item.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.totalRecords = filteredData.length;
      this.paginatedData = filteredData.slice(0, this.itemsPerPage); 
    } else {
      this.totalRecords = this.data.length;
      this.paginateData();
    }
    this.loading = false;
  }

  openCreateDialog() {
    this.selectedItem = {};
    this.displayCreateDialog = true;
  }

  changePage(event: any) {
    this.currentPage = event.page + 1;
    this.paginateData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}