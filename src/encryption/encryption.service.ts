import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { EncryptedData } from 'src/@types/encryption';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {
  private encryptionPassword: string;

  constructor(private readonly configService: ConfigService) {
    this.encryptionPassword = this.configService.get<string>(
      'ENCRYPTION_PASSWORD',
    );
  }

  async encryptData(data: string): Promise<EncryptedData> {
    const bufferData = Buffer.from(data, 'utf-8');
    const bufferIv = randomBytes(16);
    const password = this.encryptionPassword;
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, bufferIv);
    const bufferEncryptedData = Buffer.concat([
      cipher.update(bufferData),
      cipher.final(),
    ]);

    return {
      encryptedData: bufferEncryptedData.toString('hex'),
      iv: bufferIv.toString('hex'),
    };
  }
}
