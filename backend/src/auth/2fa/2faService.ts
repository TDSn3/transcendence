import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Response } from 'express';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { InfoQrCode } from '../interface/qrCode';

@Injectable()
export class AuthTwoFAService {
  constructor(private usersService: UsersService) {}

  async generateTwoFactorAuthenticationSecret(
    id: string,
    email: string,
  ): Promise<InfoQrCode> {
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

  async generateQRCode(id: string, res: Response): Promise<void> {
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
    user: User,
  ): Promise<boolean> {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
