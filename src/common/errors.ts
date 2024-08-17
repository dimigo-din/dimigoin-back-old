import { HttpException, HttpStatus } from "@nestjs/common";

export const AuthError = {
  LoginInfoUnavailable: "Auth_DB: 로그인 정보를 불러올 수 없습니다.",
  UserNotFound: "Auth_DB: 사용자 정보를 찾을 수 없습니다.",
  StudentNotFound: "Auth_DB: 학생 정보를 찾울 수 없습니다.",

  ForbiddenAuthType: "Auth_InValid: 허용되지 않은 인증 방식입니다.",
  ForbiddenUserType: "Auth_InValid: 허용되지 않은 유저 타입입니다.",
  PasswordMismatch: "Auth_InValid: 비밀번호가 일치하지 않습니다.",
  NoRefreshToken: "Auth_InValid: 리프레시 토큰이 아닙니다.",

  PermissionDenied: "Auth_Permission: 권한이 부족합니다.",

  CannotGetGoogleIdToken:
    "Auth_Google: 구글 토큰에서 id_token을 가져올 수 없습니다.",
  CannotGetGooglePayload:
    "Auth_Google: 구글 토큰에서 payload를 가져올 수 없습니다.",
};

export const UserError = {};

export const UserManageError = {
  LoginInfoUnavailable: "UserManage_L-DB: 로그인 정보를 불러올 수 없습니다.",
  UserNotFound: "UserManage_U-DB: 사용자 정보를 불러올 수 없습니다.",
};

export const MusicError = {
  InvalidVideoId:
    "Music_VideoIdInvalid: 잘못된 형식의 유튜브 비디오 아이디를 제출하였습니다.",

  AlreadyApplied: "Music_AlreadyApplied: 이미 해당 기상송이 신청되었습니다.",

  AlreadyVoted:
    "Music_AlreadyVoted: 사용자가 이미 해당 기상송을 투표하였습니다.",
  DailyVoteLimitExceeded:
    "Music_DailyApplyLimitExceeded: 하루 최대 가능한 기상송 등록 건수에 도달하였습니다.",
};

export const MusicManageError = {
  InvalidVideoId:
    "MusicManage_VideoIdInvalid: 잘못된 형식의 유튜브 비디오 아이디를 제출하였습니다.",

  AlreadyApplied:
    "MusicManage_AlreadyApplied: 이미 해당 기상송이 신청되었습니다.",

  NotApplied: "MusicManage_NotApplied: 신청되지 않은 기상송입니다.",
};

export const RateLimitError = {
  RateLimitExceeded:
    "RateLimit_TooManyRequest: 짧은 시간에 너무 많은 요청이 수신되었습니다.",
};

export const LaundryError = {
  UserNotFound: "Laundry: 해당 유저를 찾을 수 없습니다.",
  MachineNotFound: "Laundry: 해당 세탁 기기를 찾을 수 없습니다.",
  TimeNotFound: "Laundry: 해당 세탁 시간을 찾을 수 없습니다.",
  ApplyNotFound: "Laundry: 해당 세탁 신청을 찾을 수 없습니다.",

  TimeUnavailable: "Laundry: 현 시점에서 사용할 수 없는 시간입니다.",
  TimeAlreadyApplied:
    "Laundry: 이미 해당 시간이 다른사람에 의하여 신청되어있습니다.",
};

export const LaundryManageError = {
  InvalidGender: "LaundryManage: 올바르지 않은 성별입니다.",
  InvalidFloor: "LaundryManage: 허용되지 않은 기숙사 층계입니다.",
  InvalidPos: "LaundryManage: 허용되지 않은 기기 위치입니다.",
  InvalidMachine: "LaundryManage: 허용되지 않은 기기 종류입니다.",
  InvalidGrade: "LaundryManage: 올바르지 않은 학년 값입니다.",

  MachineNotFound: "LaundryManage: 존재하지 않는 기기입니다.",

  InvalidTimeFormat: "LaundryManage: 올바르지 않은 시간 형식입니다.",
  InvalidWeekdayFormat: "LaundryManage: 올바르지 않은 요일 형식입니다.",

  UserNotFound: "LaundryManage: 로그인된 사용자를 찾을 수 없습니다.",
  TimeNotFound: "LaundryManage: 존재하지 않는 시간표입니다.",
};

export const FridayHomeError = {
  UserNotFound: "FridayHome: 유저를 찾을 수 없습니다.",
  AlreadyApplied: "FridayHome: 해당 주간에 이미 금요귀가 신청이 있습니다.",
  NotApplied: "FridayHome: 해당 금요귀가 신청이 존재하지 않습니다.",
};

export const StayError = {
  UserNotFound: "Stay: 해당 유저를 찾을 수 없습니다.",
  SeatNotFound: "Stay: 해당 좌석을 찾을 수 없습니다.",
  ApplyNotFound: "Stay: 해당 신청을 찾을 수 없습니다.",
  GoingOutApplyNotFound: "Stay: 해당 외출 신청을 찾을 수 없습니다.",
  YouAlreadyApplied: "Stay: 이미 잔류신청이 되어있습니다.",
  SeatAlreadyApplied: "Stay: 이미 해당 좌석이 예약되었습니다.",

  DisAllowedGradeSeat: "Stay: 해당 학년에는 허용되지 않은 좌석입니다.",
  DisAllowedGradeApply: "Stay: 해당 학년의 잔류신청 기간이 아닙니다.",

  BeforeApply: "Stay: 아직 잔류신청 기간이 아닙니다.",
  AfterApply: "Stay: 잔류신청 기간이 지났습니다.",

  IllegalStayScheduleApplyDayUnit:
    "Stay: 잔류일정 신청 허용일 단위가 잘못되었습니다.",
  IllegalStayLocation: "Stay: 허용되지 않은 잔류위치입니다.",
  IllegalOutgoingTimeFormat: "Stay: 허용되지 않은 외출 시간 범위입니다.",
};

export const StayManageError = {};

/** 이게 모든 catch에 들어가면 번거롭고 안이뻐서 이럼. 이러니까 이쁘지?!
 *  @param { Object } base - Error bases
 *  @param { Error } error - Error message
 *  @param { HttpStatus } type - Http response code
 *  @param { string } finalMsg - Error if not filtered
 *  @param { HttpStatus } finalStatus - Error if not filtered
 */
export const ErrorHandler = (
  base: object,
  error: Error,
  type: HttpStatus,
  finalMsg?: string,
  finalStatus?: HttpStatus,
) => {
  if (Object.values(base).includes(error.message))
    throw new HttpException(error.message, type);
  if (!!finalMsg && !!finalStatus)
    throw new HttpException(finalMsg, finalStatus);
};
