import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MATERIAL = [
  MatTreeModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
];

@NgModule({
  declarations: [],
  imports: [...MATERIAL],
  exports: [...MATERIAL],
})
export class SharedModule {}
