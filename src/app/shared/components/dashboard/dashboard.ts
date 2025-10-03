import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet ,RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard  {
  constructor(private _router:Router){}

   sidebarOpen = signal(false);
  projectsOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  toggleProjects() {
    this.projectsOpen.set(!this.projectsOpen());
  }
  logout(){
    sessionStorage.removeItem('token')
    this._router.navigate(['/'],{replaceUrl: true})
  }
}
