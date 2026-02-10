import Pending from "./submission_theme_variants/pending";
import Late from "./submission_theme_variants/late";
import Reviewed from "./submission_theme_variants/reviewed";
import type { SubmissionData } from "../page";

const submission_theme_variants = {
  PENDING: Pending,
  LATE: Late,
  REVIEWED: Reviewed,
};

export default function SubmissionTheme(data: SubmissionData) {
  const ThemeComponent = submission_theme_variants[data.status];

  return <ThemeComponent {...data} />;
}
