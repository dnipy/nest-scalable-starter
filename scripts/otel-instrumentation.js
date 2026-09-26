require('dotenv/config');
const os = require('os');

process.env.OTEL_RESOURCE_ATTRIBUTES = [
  process.env.OTEL_RESOURCE_ATTRIBUTES,
  `service.instance.id=${os.hostname()}`,
]
  .filter(Boolean)
  .join(',');

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-proto');

const metricExporterUrl =
  process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ??
  'http://localhost:4318/v1/metrics';

console.log({
  OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
});

const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },

      '@opentelemetry/instrumentation-dns': {
        enabled: false,
      },

      '@opentelemetry/instrumentation-net': {
        enabled: false,
      },

      '@opentelemetry/instrumentation-ioredis': {
        requireParentSpan: true,
      },

      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: req =>
          /^\/(healthz|livez|readyz|metrics)/.test(req.url ?? ''),
      },
    }),
  ],

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: metricExporterUrl,
    }),
    exportIntervalMillis: 15000,
  }),
});

sdk.start();

const shutdown = async () => {
  await sdk.shutdown().catch(() => {});
};

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
