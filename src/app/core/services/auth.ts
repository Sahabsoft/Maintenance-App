import { Injectable, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './ApiService';
import { CreateUser } from '../../features/auth/pages/Register/models/CreateUser.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn: Signal<boolean> = this._isLoggedIn.asReadonly();

  constructor(private router: Router,private api: ApiService) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        this._isLoggedIn.set(!!localStorage.getItem('auth_token'));
      }
    } catch {
      this._isLoggedIn.set(false);
    }
  }

  login(email: string, password: string) {
    // NOTE: replace this with real API call via ApiService when available
    try {
      this.api.post<any>('/Auth/login', { email, password,twoFactorCode:'',twoFactorRecoveryCode:'' }).subscribe((response) => {
          if (response && response.data) {
                try {
                        if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) 
                          {
                            localStorage.setItem('auth_token', response.data);
                          }
                        }
                        catch {}
                this._isLoggedIn.set(true);
                this.router.navigate(['/orders']);
          } else {
            console.error('Login failed: Invalid response from server');
          }
          })
        } catch (error) {
          console.error('Login failed:', error);
        }
      }

  logout() {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        localStorage.removeItem('auth_token');
      }
    } catch {}
    this._isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
  //Register User
  Register(user: CreateUser) {
    // NOTE: replace this with real API call via ApiService when available
    try {
      this.api.post<any>('/Auth/register', user).subscribe((response) => {
          if (response && response.token) {
                try {
                        if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) 
                          {
                            localStorage.setItem('auth_token', response.token);
                          }
                        }
                        catch {}
                this._isLoggedIn.set(true);
                this.router.navigate(['/orders']);
          } else {
            console.error('Register failed: Invalid response from server');
          }
          })
        } catch (error) {
          console.error('Register failed:', error);
        }
      }
}
