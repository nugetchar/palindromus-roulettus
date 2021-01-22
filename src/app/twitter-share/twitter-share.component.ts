import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-twitter-share',
  templateUrl: './twitter-share.component.html',
  styleUrls: ['./twitter-share.component.scss']
})
export class TwitterShareComponent implements OnInit {

  @Input() tweetTxt!: string;
  @Input() via!: string;

  private baseUrl = 'https://twitter.com/intent/tweet'

  constructor() { }

  ngOnInit(): void {
  }

  get href() {
    return `${this.baseUrl}?text=${this.tweetTxt}&via=${this.via}&url=${window.location.origin}`;
  }

}
