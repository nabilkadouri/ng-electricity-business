import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
@Input() text!:string;
@Input() classe!:string;
@Input() link!:string;
@Input() point:boolean = false;
}
