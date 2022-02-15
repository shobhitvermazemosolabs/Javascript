const printName = (name) => "Hi " + name;
document.getElementById("demo").innerHTML = printName("Shobhit!");
  
const printBill = (name, bill) =>"Hi " + name + ", please pay: " + bill;
document.getElementById("top").innerHTML = printBill("Shobhit",500);

const person = {
    name: “Noam Chomsky”,
    age: 92
}
let {name} = person;
let {age} = person;
document.getElementById("cs").innerHTML = name + age;