export const gradeColorMap = {
  "A+": "#00ff88", "A": "#00ff88", "A-": "#00d970",
  "B+": "#88ff00", "B": "#77ee00", "B-": "#66dd00",
  "C+": "#ffd700", "C": "#ffcc00", "C-": "#ffaa00",
  "D+": "#ff8c00", "D": "#ff6600", "D-": "#ff4400",
  "F":  "#ff2d55",
};

export const severityColorMap = {
  nuclear: "#ff2d55",
  high:    "#ff4500",
  medium:  "#ff8c00",
};

export const getGradeColor = (grade) => {
  return gradeColorMap[grade] || "#ffffff";
};

export const getSeverityColor = (severity) => {
  return severityColorMap[severity] || "#ffffff";
};

export function getScoreTagline(score) {
  if (score <= 20) return "This repo needs last rites.";
  if (score <= 40) return "Certified disaster. Bless your heart.";
  if (score <= 60) return "Mediocre. The participation trophy of codebases.";
  if (score <= 80) return "Not bad. Not good. Just... there.";
  return "Okay fine. We respect it here.";
}

export function getScoreColor(score) {
  if (score <= 40) return "#ff2d55";
  if (score <= 70) return "#ff8c00";
  return "#00ff88";
}

export function truncateFilePath(path, maxLen = 40) {
  if (!path || path.length <= maxLen) return path;
  return '...' + path.slice(-(maxLen - 3));
}
