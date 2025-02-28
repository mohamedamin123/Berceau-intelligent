import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"], // Correction ici
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    authService.logout();
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.signIn(email, password).subscribe({
        next: (response) => {
          if (response.role == "admin") {
            this.authService.saveToken(response.token);
            this.router.navigate(["/dashboard"]);
          } else {
            this.errorMessage = "Erreur de connexion.";

          }

        },
        error: (error) => {
          this.errorMessage = error.error?.message || "Erreur de connexion.";
        },
      });
    } else {
      this.errorMessage = "Veuillez remplir correctement le formulaire.";
    }
  }
}
