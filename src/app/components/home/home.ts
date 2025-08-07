import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  angularVersion = VERSION.major;

  constructor(private router: Router) {}

  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }
}
