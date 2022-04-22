import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { ConfigServiceSpy } from './tests/spies/config.service.spy';
import { invalidEncryptedDataObj } from './tests/stubs/invalidEncryptedData.stub';

describe('EncryptionService', () => {
  let sut: EncryptionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: ConfigServiceSpy,
        },
      ],
    }).compile();

    sut = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should call ConfigService', () => {
    const envVarKey = 'ENCRYPTION_PASSWORD';

    expect(configService.get).toBeCalledWith(envVarKey);
    expect(configService.get).toBeCalledTimes(1);
  });

  it('should define the encryption password private property', () => {
    expect(sut['encryptionPassword']).toBeDefined();
  });

  describe('encryptData', () => {
    it('should return encryptedData and iv', async () => {
      const { encryptedData, iv } = await sut.encryptData('any_data');

      expect(encryptedData).toBeDefined();
      expect(iv).toBeDefined();
    });

    it('should return EncryptedData values as hexdadecimal strings', async () => {
      const hexDecPattern = /^[a-f0-9]+$/i;

      const { encryptedData, iv } = await sut.encryptData('any_data');

      expect(encryptedData).toMatch(hexDecPattern);
      expect(iv).toMatch(hexDecPattern);
    });
  });

  describe('decryptData', () => {
    it('should not match data and decryptedData when invalid password is provided', async () => {
      const data = 'any_data';

      const encryptedDataObj = await sut.encryptData(data);
      sut['encryptionPassword'] = 'invalid_password';
      const decryptedData = await sut.decryptData(encryptedDataObj);

      expect(decryptedData).not.toBe(data);
    });

    it('should throw error when invalid iv is provided', async () => {
      const encryptedDataObj = invalidEncryptedDataObj;

      const decryptResponse = sut.decryptData(encryptedDataObj);

      await expect(decryptResponse).rejects.toThrowError();
    });

    it('should return decryptedData', async () => {
      const data = 'any_data';

      const encryptedDataObj = await sut.encryptData(data);
      const decryptedData = await sut.decryptData(encryptedDataObj);

      expect(decryptedData).toBe(data);
    });
  });
});
