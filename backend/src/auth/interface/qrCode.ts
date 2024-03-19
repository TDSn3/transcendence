export interface InfoQrCode {
  secret: string;
  otpauthUrl: string;
  qrCodeDataURL: string;
}

export interface Verify2FABody {
  code: string;
  user: any; // Remplacez `any` par un type plus spécifique pour `user`, si possible
}
