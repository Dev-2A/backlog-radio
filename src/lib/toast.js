/**
 * 어디서든 호출: toast.success('...'), toast.error('...'), toast.info('...')
 */

function push(message, type = "info", duration = 3000) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("backlog-radio:toast", {
      detail: { message, type, duration },
    }),
  );
}

export const toast = {
  success: (msg, duration) => push(msg, "success", duration),
  error: (msg, duration) => push(msg, "error", duration),
  info: (msg, duration) => push(msg, "info", duration),
};
