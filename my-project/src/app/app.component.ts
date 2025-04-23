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

    var otp_offset = -1; //this is annoying ngl
    //negative 1 so first iteration is 0
    //we are ignoring certain otp vals for distribution, and are simply going to next val
    for (let i = 0; i < text.length; i++) {
      otp_offset++;
      let char = text[i];
      let shift = padNumbers[otp_offset % padNumbers.length] || 0;
      //TODO WE NEED to account for shift amnt outside of good dist
      //WE NEED 78 for alphabet AND 10 (90) for nums
      //THERE DOES NOT EXIST A LCM < 100
      console.log("shifting char: " + char + " with shift: " + shift);
      let res = this.shiftChar(char, shift, right);
      if (res === null) {
        //we have to reiterate in for loop
        //yoinking the next padNumbers val
        console.log("bad shift, reiterating...");
        //we replay the index though to not skip any char from plaintext
        i--;
        
      } else {
        result += res;
      }

    } //end for

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

  private shiftAlphabeticChar(char: string, shift: number, right: boolean): any {
    //TODO take out >=? 76 for even distribution
    if (shift > 78) {
      console.log("shift is outside alphabet even distribution bucket, recurring...");
      return null
    }

    console.log("starting shiftAlphabeticChar with char: " + char + " and shift: " + shift);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // Hardcoded alphabet
    const charLower = char.toLowerCase();
    const index = alphabet.indexOf(charLower) + 1;
    //add one for layman calcs

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

  private shiftNumericChar(char: string, shift: number, right: boolean): any {
    //for even distribution, ignore vals > 90
    if (shift > 90) {
      console.log("shift is outside numeric even distribution bucket, recurring...");
      return null
    }

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
//OTP MUST BE LONGER THAN TEXT!!!!