import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthStateModel } from '../models/auth/auth-state.model';
import { inject, Injectable } from '@angular/core';
import { AuthDetailsService } from '../services/auth-details-service/auth-details-service';
import { tap } from 'rxjs';

export class LoadUser {
  static readonly type = '[Auth] Load User';
}

export class ClearUser {
  static readonly type = '[Auth] Clear User';
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AuthState {
  private readonly authDetailsService = inject(AuthDetailsService);

  @Selector()
  static user(state: AuthStateModel) {
    return state.user;
  }

  @Action(LoadUser)
  loadUser(ctx: StateContext<AuthStateModel>) {
    return this.authDetailsService.getMyUserDetails().pipe(
      tap((authUser) => {
        ctx.patchState({ user: authUser });
      }),
    );
  }

  @Action(ClearUser)
  clearUser(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ user: null });
  }
}
