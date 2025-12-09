import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://9c42e70d0d24037b144ccd180a950cc2@o4510466850816000.ingest.us.sentry.io/4510482667601920",
  tracesSampleRate: 1.0,
  enableLogs: true,
  sendDefaultPii: true,
  debug: false,
});
