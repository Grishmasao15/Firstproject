// let str = [];
// if(process.argv.length<3){
//   str=["grishma","sao"];
//   vowelCount(str);
// }
// else{
//   let ct=process.argv.length;
//   for(let i=2;i<ct;i++){
//     str.push(process.argv[i]);
//   }
//   vowelCount(str);
// }

function vowelCountMax(str) {
  let max = 0;
  let str1='';
  let vowels=["A","E","I","O","U","a","e","i","o","u"];
  for (let i = 0; i < str.length; i++) {
    if (str[i].length > max) {
      max = str[i].length;
    }
  }
  
  for(let i=0;i<str.length;i++){
    if(str[i].length==max){
      let arr=str[i].split('');
      let count=0;
      for(let j=0;j<arr.length;j++){
        if(vowels.includes(arr[j])){
          count++;
        }
      }
      str1+= "vowel count of string" + " " + str[i] + " " + "is:" + count;
    }
  }
    return str1;
}

// vowelCount(str);
module.exports = { vowelCountMax };
