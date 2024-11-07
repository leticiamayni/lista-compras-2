import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Item } from '../models/item';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/itens';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private getUserId(): Observable<string> {
    return this.auth.user$.pipe(
      map(user => user?.sub || '')
    );
  }

  // Método para buscar os itens do usuário
  getItens(): Observable<Item[]> {
    return this.getUserId().pipe(
      switchMap(userId => 
        this.http.get<User[]>(this.apiUrl).pipe( 
          map(users => {
            const user = users.find(u => u.userId === userId);
            return user ? user.itens : [];
          })
        )
      )
    );
  }

addItem(item: Item): Observable<Item[]> {
  return this.getUserId().pipe(
    switchMap(userId =>
      this.http.get<User[]>(this.apiUrl).pipe(
        switchMap(users => {
          let user = users.find(u => u.userId === userId);
          if (!user) {
            user = { userId, itens: [] };
            users.push(user);
          }
          item.userId = userId;
          user.itens.push(item); 

         
          return this.http.put<User[]>(this.apiUrl, users).pipe(
            map(() => user.itens)
          );
        })
      )
    )
  );
}

  updateItem(item: Item): Observable<Item[]> {
    return this.getUserId().pipe(
      switchMap(userId =>
        this.http.get<User[]>(this.apiUrl).pipe(
          switchMap(users => {
            const user = users.find(u => u.userId === userId);
            if (!user) {
              throw new Error('Lista do usuário não encontrada');
            }
            const itemIndex = user.itens.findIndex(i => i.id === item.id);
            if (itemIndex === -1) {
              throw new Error('Item não encontrado');
            }
  
            user.itens[itemIndex] = item; 
  
            return this.http.put<User[]>(this.apiUrl, users).pipe(
              map(() => user.itens) 
            );
          })
        )
      )
    );
  }
  
  deleteItem(id: string): Observable<void> {
    return this.getUserId().pipe(
      switchMap(userId =>
        this.http.get<User[]>(this.apiUrl).pipe(
          switchMap(users => {
            const user = users.find(u => u.userId === userId);
            if (!user) {
              throw new Error('Lista do usuário não encontrada');
            }
            user.itens = user.itens.filter(item => item.id !== id); 
            return this.http.put<void>(this.apiUrl, users); 
          })
        )
      )
    );
  }

}
