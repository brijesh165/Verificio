import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class JwtInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        if (localStorage.getItem("token") != null) {
            const token = localStorage.getItem("token");
            const clonedRequest = req.clone({ headers: req.headers.set('Authorization', token || "") });
            return next.handle(clonedRequest);
        }
        return next.handle(req);
        // Pass the cloned request instead of the original request to the next handle
        // return next.handle(clonedRequest);
    }
}