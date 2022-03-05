export interface OauthStatus {
  status: boolean;
}

export interface OauthCSRF {
  message: string;
  data: string;
}
export interface OauthSigninData {
  id: number;
  username: string;
  token: string;
  expired: string;
}

export interface OauthSignin {
  status: boolean;
  message: string;
  data: string;
}

interface OauthErrorResponseData {
  core: any;
  code: number[];
}

export interface OauthErrorResponse {
  status: boolean;
  message: string;
  data: OauthErrorResponseData;
}

export interface OauthPermissionResponse {
  message: string;
}

export interface OauthRequest {
  status: boolean;
  message: string;
}

export interface OauthRequestParam {
  action: string;
  requestId: string;
  tokenKey: string;
}

export interface OauthForgotPasswordParam {
  email: string;
}

export interface OauthForgotPasswordConfirmParam {
  requestId: string;
  tokenKey: string;
  password: string;
  passwordConfirm: string;
}

export interface OauthEmailVerificationParam {
  requestId: string;
  tokenKey: string;
}
