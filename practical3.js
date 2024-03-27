



// const cras = [
//     {a:'1',b:'2',c:'3'},
//     {a:'4',b:'2',c:'5'},
//     {a:'6',b:'7',c:'8'}
// ];

// console.log(Object.groupBy(cras,({b})=>b));


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

function group(cars){
    result = cars.reduce(function (acc, curr) {
    acc[curr.make] = acc[curr.make] || [];
    acc[curr.make].push(curr);
    return acc;
  }, Object.create(null));

  return result;
}

module.exports={group};


//     result = num.reduce(function (r, a) {
//         r[a.b] = r[a.b] || [];
//         r[a.b].push(a);
//         return r;
//     },
//      Object.create(null));

// console.log(result);