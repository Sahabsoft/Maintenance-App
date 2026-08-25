import { Injectable } from '@angular/core'; 
import { map } from 'rxjs/operators';
import { ApiService } from './ApiService';
import { User } from '../models/User';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  list() {
    return this.api.get<User>('/user').pipe(map((r:any) => r?.data || r));
  }

  getById(id: string) {
    return this.api.get<User>(`/user/${id}`).pipe(map((r:any) => r?.data || r));
  } 
}
