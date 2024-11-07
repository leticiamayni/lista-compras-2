import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { Item } from '../models/item';
import { AuthService, User } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:3000/itens';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getUser$(): Observable<User | null | undefined> {
    return this.auth.user$;
  }

  // user
  private getUserId(): Observable<string> {
    return this.auth.user$.pipe(
      map(user => user?.sub ?? '')  // Se user?.sub for undefined, usamos uma string vazia como fallback
    );
  }

  // busca
  getItens(): Observable<Item[]> {
    return this.getUserId().pipe(
      switchMap(userId =>
        this.http.get<Item[]>(this.apiUrl).pipe(
          map(itens => itens.filter(item => item.userId === userId))
        )
      )
    );
    //return this.http.get<Item[]>(this.apiUrl);
  }

  // adiciona
  addItem(item: Item): Observable<Item[]> {
    return this.getUserId().pipe(
      switchMap(userId => {
        item.userId = userId;
        return this.http.post<Item[]>(this.apiUrl, item);
      })
    )
    //return this.http.post<Item[]>(this.apiUrl, item);
  }

  // atualiza
  updateItem(item: Item): Observable<Item[]> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if (item.userId !== userId) {
          throw new Error('Edição não autorizada');
        }
        return this.http.put<Item[]>(`${this.apiUrl}/${item.id}`, item);
      })
    )
    //return this.http.put<Item[]>(`${this.apiUrl}/${item.id}`, item);
  }

  //exclui
  deleteItem(id: string): Observable<void> {
    return this.getUserId().pipe(
      switchMap(userId => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          map(() => {
            return;
          })
        )
      })
    )
    //return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}