import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any[] = [];
  paginatedData: any[] = [];
  totalRecords: number = 0;
  searchQuery: string = '';
  loading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(private apiService: ApiService, private authService: AuthServiceService, private router: Router) { }

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

  filterData() {
    this.loading = true;
    if (this.searchQuery) {
      const filteredData = this.data.filter(item => item.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      this.totalRecords = filteredData.length;
      this.paginatedData = filteredData.slice(0, this.itemsPerPage); // Reset to first page of filtered data
    } else {
      this.totalRecords = this.data.length;
      this.paginateData();
    }
    this.loading = false;
  }

  paginate(event: any) {
    this.currentPage = event.page + 1;
    this.paginateData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}