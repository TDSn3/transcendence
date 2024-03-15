import { IsString, IsUrl } from 'class-validator';

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
