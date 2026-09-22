import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { LoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          autoLogging: {
            ignore(req) {
              const ignoredRoutes = [
                '/healthz',
                '/readyz',
                '/livez',
                '/metrics',
              ];

              return ignoredRoutes.some(route => req.url.startsWith(route));
            },
          },
          redact: {
            paths: ['req.headers.authorization', 'password'],
            censor: '[REDACTED]',
          },

          genReqId: (req, res) => {
            const id = (req.headers['x-request-id'] as string) || randomUUID();

            req.id = id;
            res.setHeader('x-request-id', id);

            return id;
          },

          level: config.get<string>('LOG_LEVEL', 'debug'),

          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? {
                  targets: [
                    {
                      target: 'pino-pretty',
                      options: {
                        colorize: true,
                        translateTime: 'SYS:standard',
                        singleLine: false,
                      },
                    },
                    {
                      target: 'pino/file',
                      options: {
                        destination:
                          config.get<string>('LOG_FILE') ?? './logs/app.log',
                        mkdir: true,
                      },
                    },
                  ],
                }
              : undefined,

          serializers: {
            req(req) {
              return {
                method: req.method,
                url: req.url,
                params: req.params,
                query: req.query,
              };
            },
            res(res) {
              return {
                statusCode: res.statusCode,
              };
            },
          },
        },
      }),
    }),
  ],
})
export class AppLoggerModule {}
