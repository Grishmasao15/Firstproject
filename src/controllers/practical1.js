
// let str="";
// for (let i=2; i<process.argv.length; i++) {
//     str+=" "+process.argv[i];
// }


function vowelsConsonants(str){
    let arr=str.split('');
    let vowels = ["A", "E", "I", "O", "U", "a", "e", "i", "o", "u"];
    let vowelStr=[];
    let consonantStr=[]; 


    for(let i=0;i<arr.length;i++){
        if(arr[i].charCodeAt(0)==32){
            continue;
        }

        else if (vowels.includes(str[i])){
            vowelStr.push(str[i])
        }

        else{
           consonantStr.push(str[i])
        }
    }
    return {vowelStr,consonantStr};
    // console.log(vowelStr);
    // console.log(consonantStr);
}

// vowelsConsonants(str);
module.exports = { vowelsConsonants }




 
