import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header as HeaderComponent } from './shared/components/header/header';
import { MsalService } from '@azure/msal-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, mergeMap } from 'rxjs';
import { environment } from '../enviroments/environment';
import { AccountInfo } from '@azure/msal-browser';
import { Store } from '@ngxs/store';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClearUser, LoadUser } from './states/auth.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('HRIS_Client');
  private readonly msalService = inject(MsalService);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  showHeader = true;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data: Data) => {
        this.showHeader = !data['hideHeader'];
      });

    this.initializeMsalAccount();
  }

  private initializeMsalAccount() {
    this.msalService
      .handleRedirectObservable()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((result) => {
          if (result?.account) {
            this.msalService.instance.setActiveAccount(result.account);
            return null;
          }

          const activeAccount = this.msalService.instance.getActiveAccount();
          if (!activeAccount) {
            this.msalService.loginRedirect({
              scopes: environment.apiScopes,
            });
            return null;
          } else {
            this.msalService.instance.setActiveAccount(activeAccount);
            return activeAccount;
          }
        }),
        filter((account): account is AccountInfo => !!account),
      )
      .subscribe({
        next: () => {
          this.store.dispatch(new LoadUser()).subscribe({
            error: (err) => {
              this.handleError(err);
            },
          });
        },
        error: (err) => {
          this.store.dispatch(new ClearUser());
          this.handleError(err);
        },
      });
  }

  private handleError(err: any) {
    console.error(err);

    this.messageService.add({
      summary: err?.error.title ?? 'Error occured',
      detail: err?.error.detail ?? 'Something went wrong! Please try again later.',
      severity: 'error',
    });

    if (err?.error?.status == 403) {
      this.router.navigate(['forbidden/no-account']);
    }
  }
}
