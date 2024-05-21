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

function palindrome(str: string): string {
    let j: number = str.length - 1;
    let str1: string = '';
    for (let i: number = 0; i < str.length / 2; i++) {
        if (str[i] != str[j]) {
            str1 += str + " is not Palindrome";
            return str1;
        }
        j--;
    }
    str1 += str + " is Palindrome";

    return str1;
}

export default palindrome;

