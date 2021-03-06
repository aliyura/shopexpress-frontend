import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(
    private titleService:Title,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Our Terms & Conditions');
  }

}
