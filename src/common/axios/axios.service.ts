import { HttpException, Inject, Logger } from '@nestjs/common';
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios';

import { AXIOS_PROVIDER } from './axios.constants';

export class AxiosService {
  constructor(
    @Inject(AXIOS_PROVIDER) private readonly axios: AxiosInstance,
    private readonly logger: Logger,
  ) {}

  public async retryableRequest<T>(
    method:
      | 'PUT'
      | 'POST'
      | 'DELETE'
      | 'GET'
      | 'PATCH'
      | 'HEAD'
      | 'OPTIONS'
      | 'TRACE',
    url: string,
    retries: number,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.request<T>({
        method,
        url,
        data,
        ...config,
      });

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.code === 'ECONNABORTED') {
        this.logger.error('Timeout on request, retrying...');
        if (retries > 0) {
          return await this.retryableRequest(
            method,
            url,
            data,
            retries - 1,
            config,
          );
        } else {
          this.logger.error(
            'Max retry attempts reached. Unable to complete request.',
          );
          throw new HttpException(
            'Max retry attempts reached. Unable to complete request.',
            500,
          );
        }
      } else {
        throw error;
      }
    }
  }
}
