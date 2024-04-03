
// let str="";
// for (let i=2; i<process.argv.length; i++) {
//     str+=" "+process.argv[i];
// }


function vowelsConsonants(str){
    let arr=str.split('');
    let vowels = ["A", "E", "I", "O", "U", "a", "e", "i", "o", "u"];
    let vowelStr=[];
    let consonantStr=[]; 
    let res = "";
    let res2="";


    if(arr.length==0){
        res2="Please enter input"
    }
    else{
        
        for(let i=0;i<arr.length;i++){
            
            if (!isNaN(arr[i])) {
              res = "please pass the valid input string"
            } else if (vowels.includes(str[i])) {
              vowelStr.push(str[i]);
            } else {
              consonantStr.push(str[i]);
            }
        }
    }

    return { vowelStr, consonantStr, res, res2 };
    // console.log(vowelStr);
    // console.log(consonantStr);
}

// vowelsConsonants(str);
module.exports = { vowelsConsonants }




 
