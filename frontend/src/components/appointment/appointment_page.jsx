import PageWrapper from "../../layouts/PageWrapper";

const Appointment = () => {
  const testPromise = new Promise((resolve, reject) => {
    const flag = false;
    if (flag) {
      return resolve("Successfully Resolved");
    } else {
      reject("Faield and Rejected");
    }
  });
let x=20;

  const myFunction = async (x) => {
    return new Promise((resolve, reject) => {
      x=x+50;
      if (x< 200) {
        resolve(x);
      } else {
        reject("Value grater then 100 is not allowed");
      }
    });
  };
  myFunction(x)
  .then((result)=>{
    console.log("Good"+ result);
    return result;
  }
  )
  .then((result)=>{
    console.log("Good Again" + result)
  }
  ).catch((error)=>{
 console.log("Bad by catch" +error);
  }
  
 );

  testPromise.then(console.log("Success By Then")).catch("Error by then");
function Person(name) {
  this.name = name;

  setTimeout(function () {
    console.log("Hello from normal:", this.name);
  }, 1000);

  setTimeout(() => {
    console.log("Hello from arrow:", this.name);
  }, 1000);
}

const p = new Person("Lucky");
console.log(p);
  return (
    <PageWrapper
      title=""
      subtitle="All active appointment are here"
    ></PageWrapper>
  );
};

export default Appointment;
