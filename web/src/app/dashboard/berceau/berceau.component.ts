import { Component } from '@angular/core';
import { GaucheComponent } from "../gauche/gauche.component";

@Component({
  selector: 'app-berceau',
  standalone: true,
  imports: [GaucheComponent],
  templateUrl: './berceau.component.html',
  styleUrl: './berceau.component.css'
})
export class BerceauComponent {

}
