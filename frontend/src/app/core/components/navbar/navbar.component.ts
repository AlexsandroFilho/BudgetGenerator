import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthModalService } from '../../services/auth-modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public authService = inject(AuthService);
  private authModalService = inject(AuthModalService);
  private router = inject(Router);

  isLoggedIn = false;

  ngOnInit(): void {
    this.authService.user$.subscribe(status => this.isLoggedIn = status);
  }

  openLogin(): void { this.authModalService.openLogin(); }
  openRegister(): void { this.authModalService.openRegister(); }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
