function vowelCount(element: string | string[]): string {
  let counter: number;
  let str: string = '';
  for (let i: number = 0; i < element.length; i++) {
    counter = 0;
    for (let j: number = 0; j < element[i].length; j++) {

      // if (!isNaN(element[i])) {
      //   str = "Wrong Data Entered";
      // }
      // else 

      if (element[i][j] == 'A' || element[i][j] == 'E' || element[i][j] == 'I' || element[i][j] == 'O' || element[i][j] == 'U' || element[i][j] == 'a' || element[i][j] == 'e' || element[i][j] == 'i' || element[i][j] == 'o' || element[i][j] == 'u') {
        counter++;
      }

    }
    str += element[i] + " " + "contains" + " " + counter + " " + "vowels" + "<br>";
  }
  return str;

}

export default vowelCount;


//isNaN 