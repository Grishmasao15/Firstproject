// let str="";
// if (process.argv.length<3) {
//     str="racecar";
//     palindrome(str);
// }
// else {
//     for (let i=2; i<process.argv.length; i++) {
//         str+=process.argv[i];
//     }
//     palindrome(str);
// }


function palindrome(str){
    let j=str.length-1;
    let str1='';
    let str2='';
    for(let i=0;i<str.length/2;i++){
        if(str[i]!=str[j]){
            str1+= str+" is not Palindrome";
            return str1;
        }
        j--;
    }
    str1+= str +" is Palindrome";
    
    return str1;
}

module.exports = { palindrome };

