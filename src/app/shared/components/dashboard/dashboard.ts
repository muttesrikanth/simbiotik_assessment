import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet ,RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard  {

   sidebarOpen = signal(false);
  projectsOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  toggleProjects() {
    this.projectsOpen.set(!this.projectsOpen());
  }
}
