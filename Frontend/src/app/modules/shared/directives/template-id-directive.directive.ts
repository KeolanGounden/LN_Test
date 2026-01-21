import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[templateId]',
  standalone: true
})
export class TemplateIdDirective {
  @Input('templateId') id!: string;
  constructor(public template: TemplateRef<any>) {}
}