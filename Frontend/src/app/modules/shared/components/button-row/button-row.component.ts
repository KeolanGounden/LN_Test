import { afterNextRender, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { DisplayButtonComponent } from '../display-button/display-button.component';
import { ButtonAlignment, ButtonConfig, ButtonType } from '../../models/button-config.model';



@Component({
  selector: 'app-button-row',
  imports: [DisplayButtonComponent, MatButtonModule, MatSlideToggleModule, MatIconModule, MatTooltipModule, MatMenuModule, MatChipsModule, CommonModule],
  templateUrl: './button-row.component.html',
  styleUrl: './button-row.component.scss'
})
export class ButtonRowComponent implements AfterViewInit, OnDestroy {
  @Input() buttonConfig: ButtonConfig[] = []

  @Input() alignment?: ButtonAlignment = ButtonAlignment.End

  currentViewIndex = 0;

  public ButtonType = ButtonType

  visibleButtons: ButtonConfig[] = [];
  overflowButtons: ButtonConfig[] = [];

  observer: ResizeObserver = new ResizeObserver(() => { });

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>
  @ViewChildren('buttonRef') buttonRefs!: QueryList<ElementRef<HTMLDivElement>>;

  maximumSize = 0;
  prevWidth = 0;

  buttonWidths: Array<number> = []

  constructor(private cdr: ChangeDetectorRef) {

    afterNextRender(() => {
      // This code will run only once in the browser after component is rendered
      this.setUpResizeObserver();
    });
  }

  ngAfterViewInit(): void {


    this.observer = new ResizeObserver(_ => {
      setTimeout(() => {
        this.recalculateButtons();

      }, 300);
    });
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.containerRef.nativeElement);
  }

  setUpResizeObserver(): void {
    const container = this.containerRef

    let element = container.nativeElement

    if (element) {
      this.observer.observe(element);
      this.recalculateButtons()
    }
  }

  recalculateButtons(): void {

    const container = this.containerRef
    const containerWidth = container.nativeElement.offsetWidth;
    const buttons = this.buttonRefs.toArray();

    if (this.prevWidth != containerWidth) {
      let visible: ButtonConfig[] = [];
      let overflow: ButtonConfig[] = [];

      const buttonWidths: Array<number> = buttons.map(btn => btn.nativeElement.offsetWidth);

      let totalButtonWidth = 0

      buttonWidths.forEach(element => {
        totalButtonWidth += element
      });

      if (buttonWidths.length > this.buttonWidths.length) {
        this.buttonWidths = buttonWidths
      }

      if (totalButtonWidth > this.maximumSize) {
        this.maximumSize = totalButtonWidth
      }


      /// Used to account for the addition of the menu button 
      let menuWidth = 50;
      let totalWidth = menuWidth;
      let paddingWidth = 8

      let totalPrevWidth = 0

      var headerButtons: ButtonConfig[] = this.buttonConfig || [];
      if (headerButtons !== undefined) {
        for (let i = 0; i < headerButtons.length; i++) {

          if (containerWidth) {


            const width = (buttonWidths[i] || 42) + paddingWidth;
            const prevWidth = this.buttonWidths[i]

            if (prevWidth) {
              totalPrevWidth += prevWidth
            }


            if (this.maximumSize != 0 && containerWidth - (totalWidth + width) < 0) {
              overflow.push(headerButtons[i]);
            }
            else {

              if (totalPrevWidth != 0 && containerWidth - totalPrevWidth < 0) {
                overflow.push(headerButtons[i]);
              }
              else {

                visible.push(headerButtons[i]);
              }

            }

            totalWidth += width;

          }
          else {
            overflow.push(headerButtons[i]);
          }


        }
      }



      this.visibleButtons = visible;
      this.overflowButtons = overflow;
      this.cdr.detectChanges();
    }


    this.prevWidth = containerWidth

  }

  overflow() {
    return (this.overflowButtons.length) && (this.overflowButtons.some(x => x.hide === undefined || x.hide() === false))
  }
}
