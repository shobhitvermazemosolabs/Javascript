//part 1
var factorial=function(n){
    var fact=1;
    for(let i=1;i<=n;i++){
        fact=fact*i;
    }
    return fact;
}
function infunction(n,factorial){
    return factorial(n)/n*factorial(n-1);
}

console.log(infunction(4,factorial));

//part2
var arrow=(firstName,lastName)=>{
    return firstName.charAt(0)+lastName.charAt(0);
}
console.log(arrow("Shobhit", "Verma"));