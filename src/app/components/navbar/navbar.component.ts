import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingDatabaseService } from 'src/app/services/routing-database.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public links: string[] = [];

  constructor(
    private databaseService: RoutingDatabaseService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.links = this.databaseService
      .getAllRoutes()
      .slice(0, -2)
      .map((route) => route.path) as string[];
  }

  public changePage(link: string) {
    this.router.navigate(['/', link]);
  }
}
