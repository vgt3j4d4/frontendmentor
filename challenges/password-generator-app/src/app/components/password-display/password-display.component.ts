import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { A11yModule, LiveAnnouncer } from '@angular/cdk/a11y';


const PASSWORD_PLACEHOLDER = 'P4$5W0rD!';

@Component({
  selector: 'app-password-display',
  imports: [CommonModule, ClipboardModule, A11yModule],
  templateUrl: './password-display.component.html',
  styleUrl: './password-display.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordDisplayComponent implements OnChanges {

  @Input() password: string = '';

  placeholder: string = PASSWORD_PLACEHOLDER;

  justCopied: boolean = false;

  constructor(private clipboardService: Clipboard, private liveAnnouncer: LiveAnnouncer) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['password']) {
      const passwordChanges = changes['password'];
      if (passwordChanges.currentValue) {
        this.liveAnnouncer.announce('A new password has been generated');
      } else {
        this.justCopied = false;
      }
    }
  }

  maybeCopyAndNotify() {
    if (this.password) {
      this.copyToClipboard();
      this.justCopied = true;
    }
  }

  private copyToClipboard() {
    this.clipboardService.copy(this.password);
  }
}
