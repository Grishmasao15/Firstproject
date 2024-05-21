
// var num = [
//     {a:'1',b:'2',c:'3'},
//     {a:'4',b:'2',c:'5'},
//     {a:'6',b:'7',c:'8'}
// ];

//  var cars = [
//    { make: "audi", model: "r8", year: "2012" },
//    { make: "audi", model: "rs5", year: "2013" },
//    { make: "ford", model: "mustang", year: "2012" },
//    { make: "ford", model: "fusion", year: "2015" },
//    { make: "kia", model: "optima", year: "2012" },
//  ];
import { GroupByInterface, groupByResultInterface } from "../intefaces/interfaces";

function group(cars: Array<GroupByInterface>) {
  let result: groupByResultInterface = cars.reduce(function (acc, curr) {
    acc[curr.make] = acc[curr.make] || [];
    acc[curr.make].push(curr);
    return acc;
  }, Object.create(null));

  return result;
}

export default group;

//Dynamic Input
