import { Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { UserInfoComponent } from "../../components/user-info/user-info.component";
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { ListComponent } from "../../components/list/list.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserInfoComponent, MatButtonModule, MatChipsModule, MatCardModule, MatIcon, MatIconModule, ListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public auth: AuthService) {}

  profile?: User | undefined | null;
  
  ngOnInit(): void {
      this.auth.user$.subscribe((profile) => {
        this.profile = profile;
    })
  }
}
