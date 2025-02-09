import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordStrengthComponent } from '../password-strength/password-strength.component';
import { PasswordDisplayComponent } from '../password-display/password-display.component';
import { PasswordGeneratorService } from '../../services/password-generator.service';
import { PasswordComplexityOption } from '../../models/password-complexity';
import { PasswordLengthSliderComponent } from '../password-length-slider/password-length-slider.component';


const PASSWORD_MIN_LENGTH = 0;
const PASSWORD_MAX_LENGTH = 20;
const PASSWORD_DEFAULT_LENGTH = 10;

interface PasswordCharacterLength {
  min: number;
  max: number;
  value: number;
}

@Component({
  selector: 'app-password-generator',
  imports: [
    FormsModule,
    PasswordDisplayComponent,
    PasswordLengthSliderComponent,
    PasswordStrengthComponent],
  providers: [PasswordGeneratorService],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.css'
})
export class PasswordGeneratorComponent implements OnInit {

  characterLength: PasswordCharacterLength = {
    min: PASSWORD_MIN_LENGTH,
    max: PASSWORD_MAX_LENGTH,
    value: PASSWORD_DEFAULT_LENGTH
  };
  includeOptions: PasswordComplexityOption[];
  complexity: number = 0;
  resultingPassword: string = '';

  constructor(private passwordGeneratorService: PasswordGeneratorService) {
    this.includeOptions = this.passwordGeneratorService.getDefaultComplexityOptions();
  }

  ngOnInit(): void {
    this.maybeGeneratePassword();
    this.updateComplexity();
  }

  updateComplexity() {
    this.complexity = this.includeOptions.filter(option => option.value).length;
  }

  /**
   * Resets the currently generated password to an empty string.
   */
  resetPassword() {
    this.resultingPassword = '';
  }

  /**
   * Attempts to generate a password if any character options are selected.
   */
  maybeGeneratePassword() {
    const selectedOptions = this.includeOptions.filter(option => option.value);
    if (selectedOptions.length > 0) {
      this.resultingPassword = this.generatePassword();
    }
  }

  /**
   * Generates a password based on the selected options and character length.
   * Ensures the password meets the desired length by adding random characters if needed.
   * @returns {string} The generated password.
   */
  private generatePassword(): string {
    const selectedOptions = this.includeOptions.filter((option) => option.value);
    const passwordLength = this.characterLength.value;

    // If no options are selected, return an empty string
    if (selectedOptions.length === 0 || passwordLength === 0) {
      return '';
    } else {
      return this.passwordGeneratorService.generatePassword(passwordLength, selectedOptions);
    }
  }
}
