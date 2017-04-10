import { Http, Response } from '@angular/http';

import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

export const showTranslationKey = 'app.stc';

declare class TranslateResponse extends Response {
    json(): Array<{ key: string, value: string }>;
}

/**
 * Api translate loader.
 * @class
 */
export class ApiTranslateLoader {

    /**
     * Initializes anew instance of the ApiTranslateLoader class.
     * @constructor
     * @param {Http} http The angular http service.
     * @param {StorageService} storage The application storage service.
     * @param {string} url The url translations.
     */
    constructor(
        private http: Http,
        private storage: StorageService,
        private url: string
    ) {
    }

    /**
     * Gets the translations from the server.
     * @param {string} lang The language to search for.
     * @returns {any}
     */
    getTranslation(lang: string) {
        const show = this.storage.getItem<boolean>(showTranslationKey) || false;

        return this.http.get(`${this.url}/${lang}/display?timestamp=${Date.now()}`).map((data: TranslateResponse) => {
            const result = new Map<string, string>();
            data.json().forEach(element => {
                result[element.key] = show ? element.key + ' (' + element.value + ')' : element.value;
            });

            return result;
        });
    }
}

/**
 * Function which represents the translate loader factory.
 * @method
 * @param {Http} http The angular http service.
 * @param {StorageService} storage The application storage service.
 * @return {ApiTranslateLoader}
 */
export function apiTranslateLoaderFactory(http: Http, storage: StorageService) {
    return new ApiTranslateLoader(http, storage, 'api/languages');
}
