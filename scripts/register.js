import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

import {auth} from "./firebaseconfig.js";

const form = document.querySelector("#form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const div = document.querySelector("#container");


form.addEventListener("submit" , (event)=>{

  event.preventDefault();

  createUserWithEmailAndPassword(auth, email.value, password.value , div)
  
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    window.location = "login.html";
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.error(errorMessage);
    div.innerHTML = errorMessage
    
  });

})
