const logger = {
  info: (message, meta = {}) => {
    console.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
  warn: (message, meta = {}) => {
    console.warn(
      JSON.stringify({
        level: "warn",
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      }),
    );
  },
  error: (message, meta = {}) => {
    const errorMeta =
      meta instanceof Error ? { stack: meta.stack, ...meta } : meta;
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        message,
        ...errorMeta,
      }),
    );
  },
};

module.exports = logger;
