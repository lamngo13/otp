import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  otp: string = '';  // Comma-separated OTP values (e.g., "3,1,4,1,5")
  inputText: string = '';  // User input text
  output: string = '';  // Stores the shifted output

  shiftRight() {
    this.output = this.shiftText(this.inputText, this.otp, true);
  }

  shiftLeft() {
    this.output = this.shiftText(this.inputText, this.otp, false);
  }

  private shiftText(text: string, pad: string, right: boolean): string {
    let result = '';
    let padNumbers = pad.split(',').map(char => parseInt(char.trim(), 10)).filter(num => !isNaN(num));

    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      let shift = padNumbers[i % padNumbers.length] || 0;
      result += this.shiftChar(char, shift, right);
    }

    return result;
  }

  private shiftChar(char: string, shift: number, right: boolean): string {
    // Handle alphabetic characters (a-z or A-Z)
    if (char.match(/[a-zA-Z]/)) {
      return this.shiftAlphabeticChar(char, shift, right);
    }
    
    // Handle numeric characters (0-9)
    if (char.match(/[0-9]/)) {
      return this.shiftNumericChar(char, shift, right);
    }
    
    // If it's neither, just return the character as is (e.g., punctuation, spaces)
    return char;
  }

  private shiftAlphabeticChar(char: string, shift: number, right: boolean): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // Hardcoded alphabet
    const charLower = char.toLowerCase();
    const index = alphabet.indexOf(charLower);

    if (index === -1) return char; // If it's not a valid alphabet character, return as is

    const maxShift = 76; // Maximum value for normalization
    const normalizedShift = Math.floor(shift * 77 / 26) % 26; // Normalize to fit a-z range
    const shiftAmount = right ? normalizedShift : -normalizedShift;
    const newIndex = (index + shiftAmount + 26) % 26;

    const shiftedChar = alphabet[newIndex];
    return char === charLower ? shiftedChar : shiftedChar.toUpperCase();
  }

  private shiftNumericChar(char: string, shift: number, right: boolean): string {
    const digits = '0123456789'; // Hardcoded digits (0-9)
    const index = digits.indexOf(char);

    if (index === -1) return char; // If it's not a valid digit, return as is

    const maxShift = 70; // Maximum value for normalization (for digits 0-9)
    const normalizedShift = Math.floor(shift * 71 / 10) % 10; // Normalize to fit 0-9 range
    const shiftAmount = right ? normalizedShift : -normalizedShift;
    const newIndex = (index + shiftAmount + 10) % 10;

    return digits[newIndex];
  }
}
