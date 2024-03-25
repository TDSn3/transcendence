import { IsString, IsNumber } from 'class-validator';

export class AddChannelMembersDto {
  @IsNumber()
  intraId: number;

  @IsString()
  name: string;
}
