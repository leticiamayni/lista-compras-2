import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
//import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:3000/itens';

  constructor(private http: HttpClient) {}

  // busca
  getItens(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  // adiciona
  addItem(item: Item): Observable<Item[]> {
    return this.http.post<Item[]>(this.apiUrl, item);
  }

  // atualiza
  updateItem(item: Item): Observable<Item[]> {
    return this.http.put<Item[]>(`${this.apiUrl}/${item.id}`, item);
  }

  //exclui
  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}