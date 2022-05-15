import { AppCluster } from './../../app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private titleService:Title,
    private app: AppCluster) { }


  ngOnInit(): void {
    this.app.loadJsFile("assets/js/main.js");
    this.titleService.setTitle(
      'Welcome to herb.ng Online Shopping for Organic, Fashion, Electronic and Many More products - ShopExpress'
    );
  }

}
