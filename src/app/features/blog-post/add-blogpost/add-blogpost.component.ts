import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';
import { BlogImage } from 'src/app/shared/components/image-selector/model/blog-image.model';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy{

model : AddBlogPost;
categories$? : Observable<Category[]>;
isImageSelectorVisible? :boolean

imageSelectSubscription?: Subscription;

constructor(private blogPostService : BlogPostService,
  private categoryService : CategoryService,
  private imageService : ImageService,
  private router : Router){
  this.model = {
    title : '',
    shortDescription : '',    
    content : '',
    featuredImageUrl : '',
    urlHandle : '',
    author : '',
    publishedDate : new Date(),
    isVisible : true,
    categories : []
  }
}
  
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategory()

    this.imageSelectSubscription = this.imageService.onSelectedImage()
    .subscribe({
      next : (selectedImage) => {
        this.model.featuredImageUrl = selectedImage.url;
        this.closeImageSelector()
      }
    })
  }

onFormSubmit() : void{
  this.blogPostService.createBlogPost(this.model)
  .subscribe( {
    next : (response) => {
      this.router.navigateByUrl('/admin/blogposts');
    }
  })
  }

  OpenImageSelector() {
    this.isImageSelectorVisible = true;
  }
    
  closeImageSelector() {
    this.isImageSelectorVisible = false;
    }

  ngOnDestroy(): void {
    this.imageSelectSubscription?.unsubscribe;
  }

}
