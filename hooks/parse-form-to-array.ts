export function parseFormToArray(formData) {
  const modules = [];
  for (let [key, value] of formData.entries()) {
    const match = key.match(/^modules\[(\d+)\]\[(\w+)\]$/);
    if (match) {
      const [, index, field] = match;
      const idx = parseInt(index);
      if (!modules[idx]) modules[idx] = {};
      modules[idx][field] = value;
    }
  }
  return modules;
}
