export enum MatchStatusEnum {
  pending = 1,
  awaited = 2,
  success = 3,
}

export interface MatchesInterface {
  id: string
  fromUser: string
  toUser: string
  status: MatchStatusEnum
}
