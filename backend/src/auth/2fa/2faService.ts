import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { toDataURL } from 'qrcode';
import { Response } from 'express';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthTwoFAService {
  constructor(
    private usersService: UsersService,
    private config: ConfigService,
  ) {}

  async generateTwoFactorAuthenticationSecret(id: string, email: string) {
    const secret: string = authenticator.generateSecret();
    const otpauthUrl: string = authenticator.keyuri(
      email,
      `ft_transcendence`,
      secret,
    );

    const qrCodeDataURL = await toDataURL(otpauthUrl); // Generate QR code data URL
    const secretHash = await bcrypt.hash(secret, 10);
    await this.usersService.addSecretTwoFA(id, secretHash);

    return {
      secret: secret,
      otpauthUrl,
      qrCodeDataURL,
    };
  }

  async generateQRCode(id: string, res: Response) {
    const user = await this.usersService.findById(id);
    if (user) {
      const updatedUser = await this.usersService.handleTwoFactorAuth(id);
      if (updatedUser.isTwoFactorAuthEnabled) {
        const result = await this.generateTwoFactorAuthenticationSecret(
          user.id,
          user.email42,
        );
        await this.usersService.addTwoFactorAuthSecret(user.id, result.secret);
        res.status(200).json(result.qrCodeDataURL);
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: any,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
