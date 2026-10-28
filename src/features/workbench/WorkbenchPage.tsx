import { useTranslation } from "react-i18next";
import { PROJECT_STATUSES, type WorkbenchProject } from "@/domain/workbench";
import { useWorkbenchProjects, workbench } from "./workbench-store";
import styles from "./WorkbenchPage.module.css";

export function WorkbenchPage() {
  const { t } = useTranslation("workbench");
  const projects = useWorkbenchProjects();

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>{t("kicker")}</p>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.intro}>{t("intro")}</p>
        </div>
        <button type="button" className={styles.add} onClick={workbench.addProject}>
          {t("add")}
        </button>
      </header>

      <p className={styles.saved}>{t("saved")}</p>

      {projects.length === 0 ? (
        <section className={styles.empty} aria-labelledby="empty-title">
          <h2 id="empty-title">{t("empty.title")}</h2>
          <p>{t("empty.body")}</p>
          <button type="button" className={styles.add} onClick={workbench.addProject}>
            {t("empty.add")}
          </button>
        </section>
      ) : (
        <div className={styles.projects}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: WorkbenchProject }) {
  const { t } = useTranslation("workbench");
  const title = project.name.trim() || t("untitled");
  const id = `project-${project.id}`;

  return (
    <article className={styles.card} aria-labelledby={`${id}-title`}>
      <div className={styles.cardHead}>
        <div>
          <p className={styles.cardKicker}>{t("projectLabel")}</p>
          <h2 id={`${id}-title`} className={styles.cardTitle}>
            {title}
          </h2>
        </div>
        <button
          type="button"
          className={styles.remove}
          onClick={() => {
            if (window.confirm(t("deleteConfirm", { name: title }))) {
              workbench.removeProject(project.id);
            }
          }}
        >
          {t("remove")}
        </button>
      </div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span>{t("fields.name")}</span>
          <input
            type="text"
            value={project.name}
            onChange={(event) => workbench.updateProject(project.id, { name: event.target.value })}
            placeholder={t("fields.namePlaceholder")}
            maxLength={100}
          />
        </label>
        <label className={styles.field}>
          <span>{t("fields.board")}</span>
          <input
            type="text"
            value={project.board}
            onChange={(event) => workbench.updateProject(project.id, { board: event.target.value })}
            placeholder={t("fields.boardPlaceholder")}
            maxLength={100}
          />
        </label>
        <label className={styles.field}>
          <span>{t("fields.status")}</span>
          <select
            value={project.status}
            onChange={(event) => {
              const status = PROJECT_STATUSES.find((item) => item === event.target.value);
              if (status) workbench.updateProject(project.id, { status });
            }}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`statuses.${status}`)}
              </option>
            ))}
          </select>
        </label>
        <label className={`${styles.field} ${styles.full}`}>
          <span>{t("fields.wiring")}</span>
          <textarea
            value={project.wiring}
            onChange={(event) =>
              workbench.updateProject(project.id, { wiring: event.target.value })
            }
            placeholder={t("fields.wiringPlaceholder")}
            rows={4}
            maxLength={5000}
          />
          <small>{t("fields.wiringHint")}</small>
        </label>
        <label className={`${styles.field} ${styles.full}`}>
          <span>{t("fields.notes")}</span>
          <textarea
            value={project.notes}
            onChange={(event) => workbench.updateProject(project.id, { notes: event.target.value })}
            placeholder={t("fields.notesPlaceholder")}
            rows={5}
            maxLength={10000}
          />
        </label>
      </div>
    </article>
  );
}
