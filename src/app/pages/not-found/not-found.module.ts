import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotFoundRoutingModule } from './not-found.routing';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, SharedModule, NotFoundRoutingModule],
})
export class NotFoundModule {}
