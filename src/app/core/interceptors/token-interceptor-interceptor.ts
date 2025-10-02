import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');

  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request);
};
