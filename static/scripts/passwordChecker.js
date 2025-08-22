import { mainChecker } from "./checks.js";

const emailInput = document.getElementById("email");

function resetBar() {
    //TO DO
    //reset the strenght BAR
}

function displayErrors(errors) {
   //TO DO
   //display the errors 

}


passwordInput.addEventListener("input", async()=>{
    const password = passwordInput.value;

    const errors = await mainChecker(password);
    displayErrors(errors)
})
