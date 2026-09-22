import { Global, Module } from '@nestjs/common';
import { ObservabilityModule } from './observability/observability.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { RuntimeModule } from './runtime/runtime.module';

@Global()
@Module({
  imports: [ObservabilityModule, InfrastructureModule, RuntimeModule],
  exports: [ObservabilityModule, InfrastructureModule, RuntimeModule],
})
export class SharedModule {}
