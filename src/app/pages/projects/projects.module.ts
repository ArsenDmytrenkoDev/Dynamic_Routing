import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsRoutingModule } from './projects.routing';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [CommonModule, SharedModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
