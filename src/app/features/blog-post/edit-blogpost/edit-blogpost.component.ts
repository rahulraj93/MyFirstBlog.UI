import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy{


  id : string | null = null;
  editPostSubscription? : Subscription;
  model? : BlogPost;
  categories$? : Observable<Category[]>;
  selectedCategories? : string[];
  isImageSelectorVisible? :boolean

  updateBlogPostSubscription? : Subscription;
  getBlogPostSubscription? : Subscription;
  deleteBlogPostSubscription? : Subscription;
  imageSelectSubscription? : Subscription;
  
  
  constructor(private router: ActivatedRoute,
    private categoryService : CategoryService,
    private blogPostService : BlogPostService,
    private imageService : ImageService,
    private route : Router) { 

     }


  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategory();
    this.editPostSubscription = this.router.paramMap.subscribe({
      next : (params) => {
        this.id = params.get('id');

        if(this.id) {
          this.getBlogPostSubscription = this.blogPostService.getBlobPostsById(this.id).subscribe({
            next: (response) => {
              this.model = response;
              this.selectedCategories = response.categories.map(x=>x.id);

            }
          })
        }

      }
    })

    this.imageSelectSubscription = this.imageService.onSelectedImage()
    .subscribe({
      next: (selectedImage) => {
        if(this.model)
          {
            this.isImageSelectorVisible = false;
            this.model.featuredImageUrl =  selectedImage.url;
          }
      }
    })
  }

  onFormSubmit() {
    //convert model to request object
    if(this.model && this.id)
      {
        var updateBlogPost: UpdateBlogPost = {
          author : this.model.author,
          content : this.model.content,
          shortDescription: this.model.content,
          urlHandle : this.model.urlHandle,
          featuredImageUrl : this.model.featuredImageUrl,
          title : this.model.title,
          isVisible : this.model.isVisible,
          publishedDate : this.model.publishedDate,
          categories : this.selectedCategories ?? []
        };
        this.updateBlogPostSubscription = this.blogPostService.updateBlobPostsById(this.id,updateBlogPost)
        .subscribe({
          next : (response) => {
            this.route.navigateByUrl('/admin/blogposts');
          }
        })
      }
    }

    OpenImageSelector() {
      this.isImageSelectorVisible = true;
    }
      
    closeImageSelector() {
      this.isImageSelectorVisible = false;
      }

    OnDeleteClick() {
      if(this.id)
      {
        this.deleteBlogPostSubscription = this.blogPostService.deleteBlobPostsById(this.id)
        .subscribe({
          next : (response) => {
            this.route.navigateByUrl('/admin/blogposts')
          }
        })
      }
      
    }

  ngOnDestroy(): void {
    this.editPostSubscription?.unsubscribe;
    this.updateBlogPostSubscription?.unsubscribe;
    this.getBlogPostSubscription?.unsubscribe;
    this.deleteBlogPostSubscription?.unsubscribe;
    this.imageSelectSubscription?.unsubscribe;
  }

}
