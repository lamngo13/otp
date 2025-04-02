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

  private alphabet: string = 'abcdefghijklmnopqrstuvwxyz';
  private validMax = 77; // 26 * 3 - 1 (ensuring equal distribution)

  shiftRight() {
    this.output = this.shiftText(this.inputText, this.otp, true);
  }

  shiftLeft() {
    this.output = this.shiftText(this.inputText, this.otp, false);
  }

  private shiftText(text: string, pad: string, right: boolean): string {
    let result = '';
    let padNumbers = pad
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num) && num <= this.validMax) // Remove out-of-range numbers
      .map(num => Math.floor(num / 3)); // Normalize to 0-25

    for (let i = 0; i < text.length; i++) {
      let char = text[i].toLowerCase();
      let shift = padNumbers[i % padNumbers.length] || 0;
      result += this.shiftChar(char, shift, right);
    }

    return result;
  }

  private shiftChar(char: string, shift: number, right: boolean): string {
    let index = this.alphabet.indexOf(char);
    if (index === -1) return char; // Ignore non-alphabetic characters

    let newIndex = right
      ? (index + shift) % 26
      : (index - shift + 26) % 26;

    return this.alphabet[newIndex];
  }
}