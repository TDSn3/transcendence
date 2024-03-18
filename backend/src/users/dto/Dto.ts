import { IsString, IsUrl, MaxLength, Matches } from 'class-validator';

export class AddFriendDto {
  @IsString()
  idUserToAddAsFriend: string;
}

export class DeleteFriendDto {
  @IsString()
  idUserToDelAsFriend: string;
}

export class AddBlockDto {
  @IsString()
  idUserToAddBlock: string;
}

export class DeleteBlockDto {
  @IsString()
  idUserToDelBlock: string;
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
