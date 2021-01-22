import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwitterShareComponent } from './twitter-share.component';



@NgModule({
  declarations: [TwitterShareComponent],
  imports: [
    CommonModule
  ],
  exports: [TwitterShareComponent]
})
export class TwitterShareModule { }
