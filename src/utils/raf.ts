export const raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (d) {
    setTimeout(d, 1);
  };
