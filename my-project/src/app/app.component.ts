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
    if (!char.match(/[a-zA-Z]/)) return char; // Ignore non-alphabetic characters

    let base = char >= 'a' ? 97 : 65; // ASCII value of 'a' or 'A'
    let newChar = right
      ? String.fromCharCode(base + (char.charCodeAt(0) - base + shift) % 26)
      : String.fromCharCode(base + (char.charCodeAt(0) - base - shift + 26) % 26);

    return newChar;
  }
}
