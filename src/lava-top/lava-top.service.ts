import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AxiosService } from '../common/axios/axios.service';
import { ContentCategory, FeedVisibility } from './lava-top.enums';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class LavaTopService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly v2Prefix = 'v2';
  private readonly v1Prefix = 'v1';

  constructor(
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.apiUrl = this.configService.get<string>('lava_top.api_url');
    this.apiKey = this.configService.get<string>('lava_top.api_key');
  }

  async getAllProducts(): Promise<{ items: ProductDTO[] }> {
    const url = `${this.apiUrl}/${this.v2Prefix}/products?contentCategories=${ContentCategory.PRODUCT}&feedVisibility=${FeedVisibility.ONLY_VISIBLE}`;

    this.logger.debug(`Calling LavaTop API for all products`);

    return await this.axiosService.retryableRequest<{
      items: ProductDTO[];
    }>('GET', url, 3, undefined, { headers: { 'X-Api-Key': this.apiKey } });
  }
}
