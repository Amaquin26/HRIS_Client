import { Component, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { ClearUser } from '../../../states/auth.state';

@Component({
  selector: 'app-no-account-page',
  imports: [ButtonModule],
  templateUrl: './no-account-page.html',
  styleUrl: './no-account-page.css',
})
export class NoAccountPage {
  private readonly msalService = inject(MsalService);
  private readonly store = inject(Store);

  onLogout() {
    this.store.dispatch(new ClearUser());
    this.msalService.logoutRedirect();
  }
}
