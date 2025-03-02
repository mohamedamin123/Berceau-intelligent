import { Component } from '@angular/core';
import { GaucheComponent } from "../gauche/gauche.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [GaucheComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
