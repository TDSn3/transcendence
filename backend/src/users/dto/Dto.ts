import { IsString, IsUrl, MaxLength, Matches } from 'class-validator';

export class AddFriendDto {
  @IsString()
  idUserToAddAsFriend: string;
}

export class DeleteFriendDto {
  @IsString()
  idUserToDelAsFriend: string;
}

export class UpdateAvatarDto {
  @IsString()
  @IsUrl()
  url: string;
}

export class UpdateLoginDto {
  @IsString()
  @MaxLength(12)
  @Matches(/^[a-z]+(-[a-z]+)*$/)
  newLogin: string;
}
