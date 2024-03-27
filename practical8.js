// const op=process.argv[3];
// const num1=process.argv[2];
// const num2 = process.argv[4];
  
function calc(num1,num2,op){

  let result="";
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

module.exports = { calc };