export const PROJECT_STATUSES = ["idea", "wiring", "building", "testing", "done"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface WorkbenchProject {
  readonly id: string;
  readonly name: string;
  readonly board: string;
  readonly status: ProjectStatus;
  readonly wiring: string;
  readonly notes: string;
}

export function createWorkbenchProject(id: string): WorkbenchProject {
  return { id, name: "", board: "", status: "idea", wiring: "", notes: "" };
}

export function updateWorkbenchProject(
  projects: readonly WorkbenchProject[],
  id: string,
  changes: Partial<Omit<WorkbenchProject, "id">>,
): readonly WorkbenchProject[] {
  return projects.map((project) =>
    project.id === id ? { ...project, ...changes } : project,
  );
}

export function removeWorkbenchProject(
  projects: readonly WorkbenchProject[],
  id: string,
): readonly WorkbenchProject[] {
  return projects.filter((project) => project.id !== id);
}
