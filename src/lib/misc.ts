export const getElapsedTime = () => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime).toFixed(2) + "ms";
    return elapsedTime;
  };
};
