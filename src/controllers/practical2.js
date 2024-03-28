// const args=process.argv[2].split(',');



function oddEven(arr){
    let odd=[];
    let even=[];
    let str='';
    for(let i=0;i<arr.length;i++){

        if(isNaN(arr[i])){
            str+= arr[i]+" "+"is not a number"+"\n";
        }
        else if(arr[i]%2==0){
            even.push(arr[i]);
        }
        else{
            odd.push(arr[i]);
        }
    }
    // console.log("odd numbers are:"+odd);
    // console.log("even numbers are:"+even);
    return{even,odd,str};
}

// oddEven(args);
module.exports={oddEven}