// const num=process.argv[2];

function fact(num){
    if(num==0){
        return 1;
    }
    else{
        return num * fact(num-1);
    }
}

// console.log(factorial(num));
module.exports={fact};