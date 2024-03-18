import { IsString, IsNumber } from 'class-validator';

export class AddGameHistoryDto {
  @IsString()
  winningUserId: string;

  @IsNumber()
  winningUserScore: number;

  @IsString()
  losingUserId: string;

  @IsNumber()
  losingUserScore: number;
}
