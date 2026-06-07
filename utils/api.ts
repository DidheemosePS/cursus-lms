export const getApiUrl = (path: string) => {
  if (typeof window !== "undefined") {
    return path;
  }

  const serverUrl = process.env.APP_URL || "http://localhost:3000";
  return `${serverUrl}${path}`;
};
