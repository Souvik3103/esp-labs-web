import { describe, expect, it } from "vitest";
import {
  createWorkbenchProject,
  removeWorkbenchProject,
  updateWorkbenchProject,
  type WorkbenchProject,
} from "./workbench";

const projects: readonly WorkbenchProject[] = [
  { id: "one", name: "Sensor", board: "ESP32-S3", status: "idea", wiring: "", notes: "" },
  { id: "two", name: "Display", board: "ESP32", status: "testing", wiring: "", notes: "" },
];

describe("workbench project updates", () => {
  it("creates a blank project with a planning status", () => {
    expect(createWorkbenchProject("new")).toEqual({
      id: "new",
      name: "",
      board: "",
      status: "idea",
      wiring: "",
      notes: "",
    });
  });

  it("updates only the matching project without mutating the list", () => {
    const updated = updateWorkbenchProject(projects, "one", { name: "Room sensor" });
    expect(updated[0]?.name).toBe("Room sensor");
    expect(updated[1]).toEqual(projects[1]);
    expect(projects[0]?.name).toBe("Sensor");
  });

  it("removes only the matching project", () => {
    expect(removeWorkbenchProject(projects, "one")).toEqual([projects[1]]);
    expect(removeWorkbenchProject(projects, "missing")).toEqual(projects);
  });
});
