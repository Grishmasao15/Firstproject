function calc(num1: number, num2: number, op: string): string {

  let result: string = "";
  switch (op) {
    case "add":
      result += parseFloat(`${num1}`) + parseFloat(`${num2}`);
      break;

    case "substraction":
      result += parseFloat(`${num1}`) - parseFloat(`${num2}`);
      break;

    case "multiplication":
      result += parseFloat(`${num1}`) * parseFloat(`${num2}`);
      break;

    case "division":
      result += parseFloat(`${num1}`) / parseFloat(`${num2}`);
      break;

    default:
      result += "Sorry, please enter a valid operator!";
  }
  return result;
}

export default calc;