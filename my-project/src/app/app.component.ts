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
    //assume number is two digits
    //TODO honestly we could return nothing (and account for that) if number is outside of set of buckets
    //yeah we could return outisde of max value prob
    //ALSO if the char to encode is a num then we can make max num 70 instead of 78 (might be a bit off; have to account for where the index starts)
    //does it start at 1 or 0?
    console.log("starting shiftAlphabeticChar with char: " + char + " and shift: " + shift);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // Hardcoded alphabet
    const charLower = char.toLowerCase();
    const index = alphabet.indexOf(charLower) + 1;
    //TODO maybe important add 1 to start at 1 and not 0
    //TODO maybe take that out ???
    // just so its more layperson readable
    console.log("index: " + index);
    console.log("charLower: " + charLower);

    if (index === -1) return char; // If it's not a valid alphabet character, return as is

    //TODO starting rewrite
    //add index to shift amount then mod 26
    var tempShift = shift
    //make negative IFF decrypting
    if (!right) {
      tempShift = -tempShift;
    }
    var newIndex = ((index + tempShift) % 26)-1;
    //IMPORTANT
    //code index is 0, human is 1, so manually adjust

    //TODO add if statement to check if newIndex is negative (if so, add 26)
    if (newIndex < 0) {
      //TODO add 26 to newIndex to make it positive
      newIndex += 26;
    }
    console.log("newIndex: " + newIndex);
    return alphabet[newIndex];
    //IMPORTANT
    //code index is 0, so manually adjust

    // if (char)

    // const maxShift = 76; // Maximum value for normalization
    // //TODO think about this
    // //26 * 3 = 78
    // const normalizedShift = Math.floor(shift * 77 / 26) % 26; // Normalize to fit a-z range
    // console.log("normalizedShift: " + normalizedShift);
    // const shiftAmount = right ? normalizedShift : -normalizedShift;
    // //im pretty sure this above was some stupid ai bs - it should all be positive so whatever
    // console.log("shiftAmount: " + shiftAmount);
    // const newIndex = (index + shiftAmount + 26) % 26;
    // console.log("newIndex: " + newIndex);

    // const shiftedChar = alphabet[newIndex];
    // console.log("shiftedChar: " + shiftedChar);

    // //ngl copilot wrote this lmao but its just ensuring correct upper/lower case
    // return char === charLower ? shiftedChar : shiftedChar.toUpperCase();
  }

  private shiftNumericChar(char: string, shift: number, right: boolean): string {
    const digits = '0123456789'; // Hardcoded digits (0-9)
    const index = digits.indexOf(char);

    if (index === -1) return char; // If it's not a valid digit, return as is
    //prob won't hit this but whatev

    //figure out distribution based on index to not favor any index
    //TOOD add if
    //TODO remove all this right stuff and remove ternary operators 

    const maxShift = 70; // Maximum value for normalization (for digits 0-9)
    const normalizedShift = Math.floor(shift * 71 / 10) % 10; // Normalize to fit 0-9 range
    const shiftAmount = right ? normalizedShift : -normalizedShift;
    const newIndex = (index + shiftAmount + 10) % 10;

    return digits[newIndex];
  }
}
