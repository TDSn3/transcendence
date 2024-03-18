import { IsString, IsNumber } from 'class-validator';

export class GameHistoryDto {
  @IsString()
  winningUserId: string;

  @IsNumber()
  winningUserScore: number;

  @IsString()
  losingUserId: string;

  @IsNumber()
  losingUserScore: number;
}
