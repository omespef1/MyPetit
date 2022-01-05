import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { AuthInterceptorProvider } from './_metronic/core/interceptors/auth.interceptor';
import { NgxPermissionsModule } from 'ngx-permissions';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsCo from '@angular/common/locales/es-CO';
import localeEsExtra from '@angular/common/locales/extra/es';

registerLocaleData(localeEsCo, 'es-CO');
registerLocaleData(localeEs, 'es-ES', localeEsExtra);

function appInitializer(authService: AuthService) {
	return () => {
		return new Promise((resolve) => {
			authService.getUserByToken().subscribe().add(resolve);
		});
	};
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		SplashScreenModule,
		TranslateModule.forRoot(),
		HttpClientModule,
		HighlightModule,
		ClipboardModule,
		AppRoutingModule,
		NgxPermissionsModule.forRoot(),
		InlineSVGModule.forRoot(),
		NgbModule,
	],
	providers: [
		AuthInterceptorProvider,
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializer,
			multi: true,
			deps: [AuthService],
		},
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: {
				coreLibraryLoader: () => import('highlight.js/lib/core'),
				languages: {
					xml: () => import('highlight.js/lib/languages/xml'),
					typescript: () =>
						import('highlight.js/lib/languages/typescript'),
					scss: () => import('highlight.js/lib/languages/scss'),
					json: () => import('highlight.js/lib/languages/json'),
				},
			},
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
