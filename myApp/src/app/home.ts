import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProjectsService, type Project } from './projects.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly projects = signal<Project[]>([]);
  protected readonly newProjectName = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly searchFilter = signal('');
  protected readonly editingProjectId = signal<number | null>(null);
  protected readonly editingProjectName = signal('');

  protected readonly filteredProjects = computed(() => {
    const search = this.searchFilter().toLowerCase().trim();
    if (!search) {
      return this.projects();
    }
    return this.projects().filter((project) => project.name.toLowerCase().includes(search));
  });

  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.loadProjects();
  }

  protected async loadProjects() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.projectsService.loadProjects();
      this.projects.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unable to load projects.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async addProject() {
    const name = this.newProjectName().trim();
    if (!name) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.projectsService.addProject(name);
      this.newProjectName.set('');
      await this.loadProjects();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unable to add project.');
      this.loading.set(false);
    }
  }

  protected async deleteProject(id: number) {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.projectsService.deleteProject(id);
      await this.loadProjects();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unable to delete project.');
      this.loading.set(false);
    }
  }

  protected startEdit(project: Project) {
    this.editingProjectId.set(project.id);
    this.editingProjectName.set(project.name);
  }

  protected cancelEdit() {
    this.editingProjectId.set(null);
    this.editingProjectName.set('');
  }

  protected async saveRename(id: number) {
    const newName = this.editingProjectName().trim();
    if (!newName) {
      this.cancelEdit();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.projectsService.renameProject(id, newName);
      this.cancelEdit();
      await this.loadProjects();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unable to rename project.');
      this.loading.set(false);
    }
  }
}
