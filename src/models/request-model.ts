import { GameModel } from './game-model';
import { UserModel } from './user-model';

export interface RequestModel {
  game: GameModel;
  // currency: string;
  amount: string;
  user: UserModel;
}
