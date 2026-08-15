import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appBrowserOnly]',
  standalone: true,
})
export class BrowserOnlyDirective implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly templateRef = inject<TemplateRef<any>>(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Code to execute in the browser environment
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
