import { Directive, ElementRef, Renderer2, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuditService } from '../../core/services/audit.service';

@Directive({
  selector: '[appSensitiveData]'
})
export class SensitiveDataDirective implements OnInit {
  @Input() appSensitiveData = true;  // true = masquer par defaut
  @Input() maskChar = '*';
  
  private originalText = '';
  private isVisible = false;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    if (this.appSensitiveData && !this.authService.peutVoirDonneesSensibles()) {
      // Must wait slightly or view might not be fully initialized in some cases
      setTimeout(() => {
        this.originalText = this.el.nativeElement.textContent;
        this.masquer();
      });
    }
  }

  @HostListener('click')
  toggleVisibilite(): void {
    if (!this.authService.peutVoirDonneesSensibles()) return;
    
    if (!this.originalText) {
       this.originalText = this.el.nativeElement.textContent;
    }

    this.isVisible ? this.masquer() : this.afficher();
    this.isVisible = !this.isVisible;
    
    if (this.isVisible) {
      this.auditService.log('VIEW_SENSITIVE', this.el.nativeElement.dataset['patientId']);
    }
  }

  private masquer(): void {
    const masked = this.maskChar.repeat(this.originalText.trim().length || 10);
    this.renderer.setProperty(this.el.nativeElement, 'textContent', masked);
    this.renderer.addClass(this.el.nativeElement, 'donnee-masquee');
  }

  private afficher(): void {
    this.renderer.setProperty(this.el.nativeElement, 'textContent', this.originalText);
    this.renderer.removeClass(this.el.nativeElement, 'donnee-masquee');
  }
}
