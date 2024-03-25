import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class AddChannelDto {
  @IsNumber()
  intraId: number;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsBoolean()
  private: boolean;
}
