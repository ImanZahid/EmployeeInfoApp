import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  constructor(
    private router: Router,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.languageService.currentLanguage$.subscribe((language) => {
      this.translate.use(language);
    });
  }

  continueAsEmployee(): void {
    sessionStorage.setItem('role', 'employee');
    this.router.navigate(['/list']);
  }

  continueAsEmployer(): void {
    sessionStorage.setItem('role', 'employer');
    this.router.navigate(['/list']);
  }

  switchLanguage(): void {
    const newLanguage =
      this.languageService.getLanguage() === 'en' ? 'tr' : 'en';
    this.languageService.setLanguage(newLanguage);
  }

  getLanguageButtonLabel(): string {
    return this.languageService.getLanguage() === 'en' ? 'TR' : 'EN';
  }
}
