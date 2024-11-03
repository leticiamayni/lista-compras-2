import { Component, OnInit } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatButtonModule, 
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    NgFor,
    AsyncPipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  form: FormGroup;
  itens: Item[] = [];
  itens$: Observable<Item[]> = new Observable<Item[]>();


  constructor(private itemService: ItemService) {
    this.form = new FormGroup({
      itemId: new FormControl(),
      nome: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required, Validators.min(1)]),
      comprado: new FormControl(false)
    });

    this.itens$ = new Observable<Item[]>();
  }

  ngOnInit(): void {
    this.getItens();
  }

  //Métodos-------------------------------------------//
  getItens(): void {
    this.itens$ = this.itemService.getItens();
  }

  addItem(): void {
    if (this.form.invalid) { return; }

    const newItem: Item = this.form.value;
    this.itemService.addItem(newItem).subscribe(() => {
      this.form.reset();
      this.getItens();
    });
  }

  deletarItem(itemId: string): void {
    this.itemService.deleteItem(itemId).subscribe(() => {
      this.getItens();
    });
  }
}
