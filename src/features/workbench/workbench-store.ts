import { createPersistentStore, useStore } from "@/lib/storage";
import {
  createWorkbenchProject,
  removeWorkbenchProject,
  updateWorkbenchProject,
  type WorkbenchProject,
} from "@/domain/workbench";

const projects = createPersistentStore<readonly WorkbenchProject[]>("esp-workbench-projects", []);

export const workbench = {
  projects,
  addProject() {
    projects.set((current) => [...current, createWorkbenchProject(crypto.randomUUID())]);
  },
  updateProject(id: string, changes: Partial<Omit<WorkbenchProject, "id">>) {
    projects.set((current) => updateWorkbenchProject(current, id, changes));
  },
  removeProject(id: string) {
    projects.set((current) => removeWorkbenchProject(current, id));
  },
};

export const useWorkbenchProjects = () => useStore(projects);
