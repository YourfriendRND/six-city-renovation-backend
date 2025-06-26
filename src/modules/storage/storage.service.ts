import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Minio from 'minio';
import { Stream } from 'node:stream';
import { PassThrough } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

import storageConfig from 'src/shared/config/storage/storage.config';

@Injectable()
export class StorageService implements OnApplicationBootstrap {
  private client: Minio.Client;
  private readonly logger = new Logger(StorageService.name);
  constructor(
    @Inject(storageConfig.KEY)
    private config: ConfigType<typeof storageConfig>,
  ) {
    this.client = new Minio.Client({
      endPoint: this.config.endpoint,
      port: this.config.port,
      useSSL: false,
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
    });

    this.createBucketIfNotExist();
  }

  async onApplicationBootstrap() {
    await this.uploadDefaultFiles();
  }

  private getMimeType(filename: string): string {
    const extension = path.extname(filename).toLowerCase();
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  }

  private async uploadDefaultFiles() {
    this.logger.log('Checking default files for application');

    const defaultFilesMap = {
      antalya_wallpaper: 'c77e0366-9411-4d5e-a8a6-066eb986ab10',
      buenos_aires_wallpaper: '787b24a2-4245-4d66-acbd-4b51f1e34a76',
      new_york_wallpaper: 'e18857d9-d0da-4bf8-8eb4-388476086e5f',
      oslo_wallpaper: '9afb7087-bc28-4d5c-8717-0b2736f2cd35',
      sao_paolo_wallpaper: 'd7a147d2-e863-481d-aa64-25aab35b5b57',
      shanghai_wallpaper: 'a8176d9a-78ba-4bf2-95b8-1f20678c49e0',
    };

    const defaultFilesDir = path.join(
      __dirname,
      '../../../assets/cities_previews',
    );
    try {
      const files = fs.readdirSync(defaultFilesDir);

      for (const file of files) {
        const [name] = file.split('.');
        const fileId = defaultFilesMap[name];
        try {
          await this.client.statObject(this.config.bucketName, fileId);
          this.logger.log(`File ${file} already exists in storage, skipping`);
        } catch (error) {
          if (error.code === 'NotFound') {
            // Файла нет в хранилище - загружаем
            const filePath = path.join(defaultFilesDir, file);
            const fileStream = fs.createReadStream(filePath);
            const fileStat = fs.statSync(filePath);

            await this.client.putObject(
              this.config.bucketName,
              fileId, // используем имя файла как ключ в MinIO
              fileStream,
              fileStat.size,
              {
                'Content-Type': this.getMimeType(file),
              },
            );
            this.logger.log(`Successfully uploaded default file: ${file}`);
          } else {
            this.logger.error(`Error checking file ${file}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error processing default files: ${error.message}`);
    }

    // Код загрузки дефолтных файлов по пути ../../assets/cities_previwes
  }

  private async createBucketIfNotExist(): Promise<void> {
    const isBucketExist = await this.client.bucketExists(
      this.config.bucketName,
    );

    if (!isBucketExist) {
      this.client.makeBucket(this.config.bucketName, 'eu-central-1');
    }
  }

  async getFile(fileId: string): Promise<Stream.Readable> {
    try {
      const stat = await this.client.statObject(this.config.bucketName, fileId);

      const fileSize = stat.size;
      this.logger.log(`Start download file ${fileId} (${fileSize} bytes)`);

      const stream = await this.client.getObject(
        this.config.bucketName,
        fileId,
      );

      const chunkedStream = new PassThrough({ highWaterMark: 3 * 1024 * 1024 });

      stream.on('data', (chunk) => {
        const isRecorded = chunkedStream.write(chunk);

        if (!isRecorded) {
          stream.pause();
          chunkedStream.once('drain', () => stream.resume());
        }
      });

      stream.on('end', () => {
        this.logger.log(`File ${fileId} completely downloaded`);
        chunkedStream.end();
      });

      stream.on('error', (err) => {
        chunkedStream.destroy(err);
      });

      return chunkedStream;
    } catch (error) {
      this.logger.error(`Something trouble with file with id: ${fileId}`);
      throw error;
    }
  }
}
