export const redirectValidator = (redirect: string): boolean => {
  const redirectList: string[] = [
    "signin",
    "signup",
    "request"
  ];
  const domainAutorized: string[] = [
    "localhost",
    "myponyasia.com",
  ];
  if (redirectList.indexOf(redirect) > -1) {
    return true;
  }
  let isMatch = false;
  domainAutorized.forEach(domain => {
    if (redirect.includes(domain)) {
      isMatch = true;
    }
  })
  return isMatch;
}

export const isLocalRoute = (redirect: string): boolean => {
  const redirectList: string[] = [
    "signin",
    "signup",
    "request"
  ];
  if (redirectList.indexOf(redirect) > -1) {
    return true;
  }
  return false;
}
