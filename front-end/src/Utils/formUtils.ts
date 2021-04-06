export const getEventImages = (files: File[], pictures: string[]): string[] => {
  return pictures.map((picture) => {
    return picture.split(";")?.[2].substr(7);
  });
};
