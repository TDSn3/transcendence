import { IsString } from 'class-validator';

export class AddFriendDto {
  @IsString()
  idUserToAddAsFriend: string;
}

export class DeleteFriendDto {
  @IsString()
  idUserToDelAsFriend: string;
}
