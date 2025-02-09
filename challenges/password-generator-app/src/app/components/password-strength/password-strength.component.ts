import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { A11yModule, LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-password-strength',
  imports: [CommonModule, A11yModule],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordStrengthComponent implements OnChanges {

  @Input() complexity: number = 0;

  complexityLabelMap: Map<number, string> = new Map([
    [1, 'Too weak!'],
    [2, 'Weak'],
    [3, 'Medium'],
    [4, 'Strong'],
  ]);

  constructor(private liveAnnouncer: LiveAnnouncer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['complexity']) {
      const complexityChanges = changes['complexity'];
      if (complexityChanges.currentValue && this.complexityLabelMap.has(complexityChanges.currentValue)) {
        const label = this.complexityLabelMap.get(complexityChanges.currentValue);
        this.liveAnnouncer.announce(`The generated password strength will be ${label}`);
      }
    }
  }
}
