import { Logger, Module } from '@nestjs/common';

import { AxiosProvider } from './axios.provider';
import { AxiosService } from './axios.service';

@Module({
  providers: [AxiosProvider, AxiosService, Logger],
  exports: [AxiosProvider, AxiosService],
})
export class AxiosModule {}
