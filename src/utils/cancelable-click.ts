export const createCancelableClick = (callback: () => void) => {
  let prevX = 0;
  let prevY = 0;
  const down = (event: PointerEvent) => {
    prevX = event.clientX;
    prevY = event.clientY;
  };
  const up = (event: PointerEvent) => {
    const diff = Math.abs(event.clientX - prevX) + Math.abs(event.clientY - prevY);
    if (diff < 8) {
      callback();
    }
  };
  return { down, up };
};
