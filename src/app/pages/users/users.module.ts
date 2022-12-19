import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersRoutingModule } from './users.routing';

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, SharedModule, UsersRoutingModule],
})
export class UsersModule {}
