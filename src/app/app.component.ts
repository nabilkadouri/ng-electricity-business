import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {initFlowbite} from 'flowbite'
import { HeaderComponent } from './layouts/public-layout/components/header/header.component';
import { FooterComponent } from './layouts/public-layout/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'electricity-business';

  ngOnInit(): void {
    initFlowbite();
  }
}
