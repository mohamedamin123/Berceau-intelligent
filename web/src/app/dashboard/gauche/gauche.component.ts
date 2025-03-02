import { Component } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gauche',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gauche.component.html',
  styleUrl: './gauche.component.css'
})
export class GaucheComponent {


  constructor(private authService: AuthService) {


  }


logout() {
  this.authService.logout();
}

}
