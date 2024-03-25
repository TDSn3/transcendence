import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddChannelMembersDto {
  @IsNumber()
  intraId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password?: string;
}
