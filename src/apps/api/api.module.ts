import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FeaturesModule } from 'src/features/features.module';
import { HttpModule } from 'src/shared/http/http.module';
import { RequestMetricsMiddleware } from 'src/shared/http/middleware/request-metrics.middleware';
import { HealthzModule } from 'src/shared/runtime/healthz/api/healthz.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, HealthzModule, HttpModule, FeaturesModule],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMetricsMiddleware).forRoutes('*');
  }
}
