export interface BaseQueryParam {
  action?: string;
  redirect?: string;
  ref?: string;
  token?: string;
  request?: string;
}

export interface BaseErrorQueryParam {
  title?: string;
  desc?: string;
}
