import { Injectable } from '@angular/core';

export interface Project {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  async loadProjects(): Promise<Project[]> {
    try {
      const response = await fetch('/api/projects');

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data ?? [];
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to load projects.');
    }
  }

  async addProject(name: string): Promise<void> {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to add project.');
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to delete project.');
    }
  }

  async renameProject(id: number, newName: string): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unable to rename project.');
    }
  }
}
