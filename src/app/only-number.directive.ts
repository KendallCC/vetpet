import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  constructor() { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isNumberKey = (event.key >= '0' && event.key <= '9');
    const isAllowedKey = allowedKeys.includes(event.key);
    
    if (!isNumberKey && !isAllowedKey) {
      event.preventDefault();
    }
  }
}