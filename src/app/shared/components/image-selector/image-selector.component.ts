import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { BlogImage } from './model/blog-image.model';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {


  private file?: File;
  fileName : string = '';
  title : string = '';
  images$? : Observable<BlogImage[]>

  @ViewChild('form', {static:false}) imageUploadForm?: NgForm

  constructor(private imageService : ImageService){
  }

  ngOnInit(): void {
    this.getImage();
  }


  OnFileUploadChange(event: Event) : void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }

  uploadImage() {
    if(this.file && this.fileName !== '' && this.title !== '')
    {
      this.imageService.uploadImage(this.file,this.fileName,this.title)
      .subscribe({
        next : (response) => {
          this.imageUploadForm?.resetForm();
          this.getImage()
        }
      })
    }
  }

  selectImage(image : BlogImage) : void{
    this.imageService.selectImage(image)
  }

  private getImage()
  {
    this.images$ = this.imageService.getAllImages();
  }

}
