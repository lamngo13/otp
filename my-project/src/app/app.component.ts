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
  otp: string = '';  
  inputText: string = ''; 
  output: string = '';  

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
    //TODO this set of functioncalls to shiftAlphabeticChar and shiftNumericChar
    //could be called recursively to handle distribution
    //alphabet chars
    if (char.match(/[a-zA-Z]/)) {
      return this.shiftAlphabeticChar(char, shift, right);
    }
    
    // nums
    if (char.match(/[0-9]/)) {
      return this.shiftNumericChar(char, shift, right);
    }
    
    // return special chars
    //TODO we COULD account for this (like hard ascii vals) 
    // but that sounds hard and I don't want to do that
    return char;
  }

  private shiftAlphabeticChar(char: string, shift: number, right: boolean): string {
    //TODO take out >=? 76 for even distribution

    console.log("starting shiftAlphabeticChar with char: " + char + " and shift: " + shift);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // Hardcoded alphabet
    const charLower = char.toLowerCase();
    const index = alphabet.indexOf(charLower) + 1;
    //idk if alphabet.indexOf is case-sensitive but I'm too lazy to check!

    console.log("index: " + index);
    console.log("charLower: " + charLower);

    if (index === -1) return char; // for any funky dunky stuff

    //add index to shift amount then mod 26
    var tempShift = shift
    //make negative IFF decrypting
    if (!right) {
      tempShift = -tempShift;
    }
    var newIndex = ((index + tempShift) % 26)-1;
    //IMPORTANT
    //code index is 0, human is 1, so manually adjust

    //if newIndex is negative, add 26 to it to make it positive
    //this simulates wrapping around the alphabet!!
    if (newIndex < 0) {
      newIndex += 26;
    }
    console.log("newIndex: " + newIndex);
    return alphabet[newIndex];

  }

  private shiftNumericChar(char: string, shift: number, right: boolean): string {

    const digits = '0123456789'; // Hardcoded digits (0-9)
    const index = digits.indexOf(char);
    console.log("numIndex: " + index);

    if (index === -1) return char; // If it's not a valid digit, return as is
    //prob won't hit this but whatev


    //can we just mod by 10 and that works?
    //TODO does this work for big numbers??
    var new_shifted = 0; //just instantiate for now
    if (right) {
      new_shifted = (index + shift) % 10;
    } else {
      new_shifted = (index - shift) % 10;
    }
    //var new_shifted = (shift + index) % 10;
    console.log("new_shifted: " + new_shifted);

    //TODO idk if this works but we have to account for decrypt with big numbers
    if (!right) {
      new_shifted = ((new_shifted)+10) % 10;
    }

    const newIndex = new_shifted
    console.log("newIndex: " + newIndex);

    return digits[newIndex];
  }
}

//random notes for page
//nums are 0-9 inclusive
//letters are a-z inclusive
//A is considered index 1 for ur own calcs
//PHYSICALLY BURN KEY AFTER USE
