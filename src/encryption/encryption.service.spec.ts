import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { ConfigServiceSpy } from './tests/spies/config.service.spy';

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
      const hexDecPattern = /[a-f0-9]/i;

      const { encryptedData, iv } = await sut.encryptData('any_data');

      expect(encryptedData).toMatch(hexDecPattern);
      expect(iv).toMatch(hexDecPattern);
    });
  });
});
