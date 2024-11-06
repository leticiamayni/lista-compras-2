import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid'
//import { AuthService } from '@auth0/auth0-angular';


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

export class ListComponent implements OnInit, OnChanges {

  form: FormGroup;
  itens: Item[] = [];
  itensAdicionados: Item[] = [];
  itens$: Observable<Item[]> = new Observable<Item[]>();
  itensDataSource = new MatTableDataSource<Item>(this.itens);
  itensAdicionadosDataSource = new MatTableDataSource<Item>(this.itensAdicionados);


  constructor(private itemService: ItemService) {
    this.form = new FormGroup({
      id: new FormControl<string | null>(null),
      nome: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required, Validators.min(1)]),
      comprado: new FormControl(false)
    });

    this.itens$ = new Observable<Item[]>();
  }

  ngOnInit(): void {
    this.getItens();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itens'] || changes['itensAdicionados']) {
      this.updateItem();
    }
  }

  //Métodos-------------------------------------------//
  getItens(): void {
    this.itens$ = this.itemService.getItens();

    this.itens$.subscribe(itens => {
      this.itens = itens.filter(item => !item.comprado);
      this.itensAdicionados = this.itens.filter(item => item.comprado);

      this.itensDataSource.data = this.itens;
      this.itensAdicionadosDataSource.data = this.itensAdicionados;
      
    })
  }

  addItem(): void {
    if (this.form.invalid) { return; }

    const newItem: Item = { 
      id: this.form.value.id || uuidv4(), 
      nome: this.form.value.nome, 
      quantidade: this.form.value.quantidade, 
      comprado: this.form.value.comprado || false }; 
      
      if (this.form.value.id) { 
      this.itemService.updateItem(newItem).subscribe(() => { 
        this.getItens(); 
        this.form.reset({ comprado: false });
      }); 
    } else { 
        this.itemService.addItem(newItem).subscribe(() => { 
          this.getItens(); 
          this.form.reset({ comprado: false });
        }); 
      }
  }

  updateItem(): void {
    if (this.form.invalid) { return; }

    const updatedItem: Item = {
      id: this.form.value.id,
      nome: this.form.value.nome,
      quantidade: this.form.value.quantidade,
      comprado: this.form.value.comprado || false
    };

    this.itemService.updateItem(updatedItem).subscribe(() => { 
      this.getItens();
      this.form.reset();
    });
  }

  deletarItem(id: string): void {
    this.itemService.deleteItem(id).subscribe(() => {
      this.getItens();
    });
  }

  editItem(item: Item): void {
    this.form.patchValue(item);
  }

  checkedItem(item: Item): void {
    // Alterna o valor de 'comprado'
    item.comprado = !item.comprado;

    // Atualiza o item no serviço
    this.itemService.updateItem(item).subscribe(() => {
        // Remove o item da lista atual e adiciona na outra lista conforme o valor de 'comprado'
        if (item.comprado) {
            this.itens = this.itens.filter(i => i.id !== item.id);
            this.itensAdicionados.push(item);
        } else {
            this.itensAdicionados = this.itensAdicionados.filter(i => i.id !== item.id);
            this.itens.push(item);
        }

        this.itensDataSource.data = [...this.itens]; 
        this.itensAdicionadosDataSource.data = [...this.itensAdicionados];
    });
  }
}