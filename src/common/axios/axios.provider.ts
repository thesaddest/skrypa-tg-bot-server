import { Provider } from '@nestjs/common';
import axios from 'axios';

import { AXIOS_PROVIDER } from './axios.constants';

// Add additional axios configuration if needed
export const AxiosProvider: Provider = {
  provide: AXIOS_PROVIDER,
  useFactory: () => {
    return axios.create();
  },
};
