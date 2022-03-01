import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { EncryptedData } from 'src/@types/encryption';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}
  async encryptData(data: string): Promise<EncryptedData> {
    const bufferData = Buffer.from(data, 'utf-8');
    const iv = randomBytes(16);
    const password = this.configService.get<string>('ENCRYPTION_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedData = Buffer.concat([
      cipher.update(bufferData),
      cipher.final(),
    ]);

    return {
      iv: iv.toString('hex'),
      encryptedData: encryptedData.toString('hex'),
    };
  }

  async decryptData(data: string, iv: string): Promise<string> {
    const bufferIv = Buffer.from(iv, 'hex');
    const bufferData = Buffer.from(data, 'hex');
    const password = this.configService.get<string>('ENCRYPTION_PASSWORD');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, bufferIv);

    const decryptedData = Buffer.concat([
      decipher.update(bufferData),
      decipher.final(),
    ]);

    return decryptedData.toString();
  }
}
