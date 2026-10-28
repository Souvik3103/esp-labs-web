import { useTranslation } from "react-i18next";
import { WorkbenchPage } from "@/features/workbench/WorkbenchPage";

export function Component() {
  const { t } = useTranslation();
  return (
    <>
      <title>{t("titles.workbench")}</title>
      <WorkbenchPage />
    </>
  );
}
