import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories$?: Observable<Category[]>;
  totalCount? : number;
  pageNumber = 1;
  pageSize = 5;
  list : number [] = [];

  constructor(private categoryService: CategoryService) {

  }
  
  ngOnInit(): void {
    this.categoryService.getCategoryCount()
    .subscribe({
      next : (value) => {
        this.totalCount = value;
        this.list = new Array(Math.ceil(value/this.pageSize))

        this.categories$ = this.categoryService.getAllCategory(
          undefined,
          undefined,
          undefined,
          this.pageNumber,
          this.pageSize
        );
      }
    })
    
  }

  OnSearch(query : string) {
    this.categories$ = this.categoryService.getAllCategory(query);
    }

  Sort(sortBy: string,sortDirection: string) {
    this.categories$ = this.categoryService.getAllCategory(undefined, sortBy, sortDirection);
    }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.categories$ = this.categoryService.getAllCategory(
      undefined,
      undefined,
      undefined,
      pageNumber,
      this.pageSize )
    }

  getNextPage() {
    if(this.pageNumber + 1 > this.list.length){
        return;
      }

    this.pageNumber += 1;
    this.categories$ = this.categoryService.getAllCategory(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize )
    }


    getPrevPage() {
      if(this.pageNumber - 1 > 1){
        return;
      }

    this.pageNumber -= 1;
    this.categories$ = this.categoryService.getAllCategory(
      undefined,
      undefined,
      undefined,
      this.pageNumber,
      this.pageSize )
    }
}
