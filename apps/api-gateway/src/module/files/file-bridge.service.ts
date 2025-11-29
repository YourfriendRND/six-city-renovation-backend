import { storageAppConfig } from '@libs/config';
import { FileInterface } from '@libs/types';
import {
  Inject,
  Injectable,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

@Injectable()
export class FileBridgeService {
  constructor(
    @Inject(storageAppConfig.KEY)
    private readonly storageConfig: ConfigType<typeof storageAppConfig>,
  ) {}

  private makeStorageUrl(): string {
    const storageHost = this.storageConfig.applicationHost;

    if (storageHost === 'localhost') {
      return `http://${storageHost}:${this.storageConfig.port}/storage`;
    }

    return `http://${storageHost}/storage`;
  }

  async getFile({
    id,
    mimetype,
    name,
    size,
  }: FileInterface): Promise<StreamableFile> {
    try {
      const storageServiceUrl = `${this.makeStorageUrl()}/${id}`;

      const { data } = await axios.get(storageServiceUrl, {
        responseType: 'stream',
        timeout: 5000,
      });

      const streamableFile = new StreamableFile(data, {
        type: mimetype,
        length: size,
        disposition: `inline; filename="${name}"`,
      });

      return streamableFile;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw err;
      }

      throw new UnprocessableEntityException(
        `Trouble with downloading file id: ${id}`,
      );
    }
  }
}
