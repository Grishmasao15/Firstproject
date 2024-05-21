import { vowelInterface } from "../intefaces/interfaces";

function vowelsConsonants(str: string): vowelInterface {
  let arr: string[] = str.split('');
  let vowels: string[] = ["A", "E", "I", "O", "U", "a", "e", "i", "o", "u"];
  let VowelStr: string[] = [];
  let consonantStr: string[] = [];
  let res: string = "";


  if (arr.length == 0) {
    res = "Please enter input"
  }
  else {

    for (let i: number = 0; i < arr.length; i++) {

      // if (!isNaN(arr[i])) {
      //   res = "please pass the valid input string"
      // } else

      if (vowels.includes(str[i])) {
        VowelStr.push(str[i]);
      } else {
        consonantStr.push(str[i]);
      }
    }
  }

  return { VowelStr, consonantStr, res };

}

export default vowelsConsonants;






//isNan



