interface ModuleDraft {
  title?: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
}

export function parseFormToArray(formData: FormData) {
  const modules: ModuleDraft[] = [];

  // Loop through each entries
  for (const [key, value] of formData.entries()) {
    // To detect module fields modules[number][text]. eg. modules[1][title]
    const match = key.match(/^modules\[(\d+)\]\[(\w+)\]$/);

    // If its not match skip iteration
    if (!match) continue;

    // Extract index and field name, "," to skip the first element which is the full match
    const [, index, field] = match;

    // Convert index to number "2" to 2
    const idx = parseInt(index);

    // Exists before adding
    if (!modules[idx]) modules[idx] = {};

    // modules[idx][field] = value
    modules[idx][field as keyof ModuleDraft] = String(value);
  }

  return modules;
}
