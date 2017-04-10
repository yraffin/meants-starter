import { TranslateService } from '@ngx-translate/core';

import { StorageService } from './storage.service';
import { showTranslationKey } from './api-translate-loader';

/**
 * Represents the header component.
 * @class
 */
export abstract class BaseTranslationComponent {

    /**
     * Initializes a new instance of the HeaderComponent class.
     * @constructor
     * @param {StorageService} storage The application storage service.
     * @param {TranslateService} translationService The angular translation service.
     */
    constructor(
        protected storage: StorageService,
        protected translationService: TranslateService,
    ) { }

    /**
     * Allow to show / hide translation codes.
     * @method
     * @param {Event} event The current click event.
     */
    showTranslationCode(event: Event) {
        event.preventDefault();

        const show = this.storage.getItem<boolean>(showTranslationKey) || false;
        this.storage.setItem(showTranslationKey, !show);

        const lang = this.translationService.currentLang;
        this.translationService.getTranslation(lang)
            .subscribe((result) => {
                this.translationService.onLangChange.emit({ lang: lang, translations: result });
            });
    }
}
