import { Http, Request, RequestOptionsArgs, Response } from '@angular/http';
import { AuthHttp, AuthConfig, IAuthConfigOptional } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { AuthorizationService } from './authorization.service';

/**
 * Represents the http client with bearer authorization.
 * @class
 */
export class AuthorizationHttp extends AuthHttp {

    /**
     * Initializes a new instance of the AuthHttp class.
     * @constructor
     * @param {AuthorizationService} authorizationService The application authorization service.
     * @param {Http} http The http service.
     * @param {IAuthConfigOptional} config authorization configuration.
     */
    constructor(private authorizationService: AuthorizationService, http: Http, config: IAuthConfigOptional) {
        super(new AuthConfig(config), http);
    }

    /**
     * Perform a http request.
     * @method
     * @param {string|Request} url The requested url.
     * @param {RequestOptionsArgs} options The request options.
     * @return {Observable<Response>} The http request response.
     */
    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (!this.authorizationService.authInfo || this.authorizationService.loggedIn()) {
            return super.request(url, options);
        }

        // perform a refresh token before
        return this.authorizationService.refresh()
            .flatMap(response => super.request(url, options));
    }
}

/**
 * Function which represents the authorization http factory.
 * @method
 * @param {AuthorizationService} authorizationService The application authorization service.
 * @param {Http} http The angular http service.
 * @returns {AuthorizationHttp}
 */
export function authorizationHttpFactory(authorizationService: AuthorizationService, http: Http) {
    return new AuthorizationHttp(authorizationService, http, {
        globalHeaders: [{ 'Accept': 'application/json' }],
        headerPrefix: 'JWT',
        tokenGetter: (() => authorizationService.token)
    });
}
