import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'app-password-length-slider',
  imports: [FormsModule],
  templateUrl: './password-length-slider.component.html',
  styleUrl: './password-length-slider.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordLengthSliderComponent implements AfterViewInit {

  @Input() minLength: number = 0;
  @Input() maxLength: number = 20;
  @Output() lengthChange = new EventEmitter<number>();
  @ViewChild('slider') slider!: ElementRef<HTMLInputElement>;
  value: number = 0;

  inputId = `slider-${uuid.v4()}`;

  ngAfterViewInit(): void {
    const progress = this.calculateProgress(this.value);
    this.slider.nativeElement.style.setProperty('--progress', `${progress}%`);
  }

  notifyLengthChange() {
    this.lengthChange.emit(this.value);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const progress = this.calculateProgress(Number(value));
    this.slider.nativeElement.style.setProperty('--progress', `${progress}%`);
  }

  private calculateProgress(value: number): number {
    return ((value - this.minLength) / (this.maxLength - this.minLength)) * 100;
  }

}
