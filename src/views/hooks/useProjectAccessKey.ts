export const useProjectAccessKey = () => {
  const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;

  return projectAccessKey;
};
