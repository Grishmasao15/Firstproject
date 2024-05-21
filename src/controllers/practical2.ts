
import { OddEvenInterface } from "../intefaces/interfaces";

function oddEven(arr: number[]): OddEvenInterface {
    let odd: number[] = [];
    let even: number[] = [];
    let str: string = '';
    for (let i: number = 0; i < arr.length; i++) {

        if (isNaN(arr[i])) {
            str += arr[i] + " " + "is not a number" + "<br>";
        }
        else if (arr[i] % 2 == 0) {
            even.push(arr[i]);
        }
        else {
            odd.push(arr[i]);
        }
    }
    return { even, odd, str };
}

export default oddEven;