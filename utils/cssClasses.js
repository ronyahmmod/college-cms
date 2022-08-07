export const combineClasses = (...classList) => {
  return classList.reduce(
    (prevClass, currentClass) => prevClass + " " + currentClass
  );
};
