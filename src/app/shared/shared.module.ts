import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

const MATERIAL = [
  MatTreeModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
];

@NgModule({
  declarations: [],
  imports: [...MATERIAL, ReactiveFormsModule, FormsModule],
  exports: [...MATERIAL, ReactiveFormsModule, FormsModule],
})
export class SharedModule {}
