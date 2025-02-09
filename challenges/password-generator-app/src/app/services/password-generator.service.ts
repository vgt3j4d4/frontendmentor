import { Injectable } from '@angular/core';
import { PasswordComplexityOption } from '../models/password-complexity';

const DEFAULT_COMPLEXITY_OPTIONS: PasswordComplexityOption[] = [{
  id: 'uppercase',
  label: 'Include Uppercase Letters',
  value: true
}, {
  id: 'lowercase',
  label: 'Include Lowercase Letters',
  value: true
}, {
  id: 'numbers',
  label: 'Include Numbers',
  value: true
}, {
  id: 'symbols',
  label: 'Include Symbols',
  value: false
}];

const UPPERCASE_LETTERS: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE_LETTERS: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBERS: string[] = '0123456789'.split('');
const SYMBOLS: string[] = '!@#$%^&*()_+-=[]{}|;:,.<>/?'.split('');

@Injectable({
  providedIn: 'root'
})
export class PasswordGeneratorService {

  /**
   * Retrieves the default password complexity options.
   * @returns A copy of the default password complexity options.
   */
  public getDefaultComplexityOptions(): PasswordComplexityOption[] {
    return DEFAULT_COMPLEXITY_OPTIONS.map(option => ({ ...option }));
  }

  public generatePassword(passwordLength: number, options: PasswordComplexityOption[]): string {
    let tempPassword = '';

    // Add at least one character from each option
    options.forEach((option) => {
      tempPassword += this.getCharacterBasedOnOption(option);
    });

    // If the password is too short, add random options until it is long enough
    while (tempPassword.length < passwordLength) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      tempPassword += this.getCharacterBasedOnOption(randomOption);
    }

    // To add more randomness, shuffle the password
    return this.shuffleString(tempPassword);
  }

  /**
   * Retrieves a random character based on the given password option.
   * @param {PasswordComplexityOption} option - The password option to get a character for.
   * @returns {string} A random character corresponding to the option or an empty string if the option is not valid.
   */
  private getCharacterBasedOnOption(option: PasswordComplexityOption): string {
    if (option.id === 'uppercase') {
      return this.getRandomUpperCaseLetter();
    } else if (option.id === 'lowercase') {
      return this.getRandomLowerCaseLetter();
    } else if (option.id === 'numbers') {
      return this.getRandomNumber();
    } else if (option.id === 'symbols') {
      return this.getRandomSymbol();
    }
    return '';
  }

  /**
   * Returns a random uppercase letter.
   * @returns {string} A random uppercase letter.
   */
  private getRandomUpperCaseLetter = () => UPPERCASE_LETTERS[Math.floor(Math.random() * UPPERCASE_LETTERS.length)];

  /**
   * Returns a random lowercase letter.
   * @returns {string} A random lowercase letter.
   */
  private getRandomLowerCaseLetter = () => LOWERCASE_LETTERS[Math.floor(Math.random() * LOWERCASE_LETTERS.length)];

  /**
   * Returns a random number as a string.
   * @returns {string} A random number.
   */
  private getRandomNumber = () => NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

  /**
   * Returns a random symbol character.
   * @returns {string} A random symbol.
   */
  private getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  /**
   * Shuffles the characters in a given string.
   * @param {string} str - The string to shuffle.
   * @returns {string} The shuffled string.
   */
  private shuffleString(str: string): string {
    return str.split('').sort(() => Math.random() - 0.5).join('');
  }
}
