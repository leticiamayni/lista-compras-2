import { Component, Inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, MatButtonModule, MatIconModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  constructor(public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  profile?: User | undefined | null;

  ngOnInit(): void {
    this.auth.user$.subscribe((profile) => {
      this.profile = profile;
    })
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }

}
