function getData(uId) {
    setTimeout(() => {
    console.log("Fetched the data!");
    }, 4000);
    return "skc@gmail.com";
}
    
console.log("start");
var email = getData("skc");
console.log("Email id of the user id is: " + email);
console.log("end");