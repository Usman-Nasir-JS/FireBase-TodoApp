import { signInWithEmailAndPassword , GoogleAuthProvider , signInWithPopup} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

import { auth } from "./firebaseconfig.js";


const provider = new GoogleAuthProvider();

const form = document.querySelector("#form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const div = document.querySelector("#container");

form.addEventListener("submit" , (event)=>{
    
  event.preventDefault();

  signInWithEmailAndPassword(auth, email.value, password.value , div)
  
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    window.location = "index.html";
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    div.innerHTML = errorMessage;
  })

})

const googleBtn = document.querySelector("#googleBtn");

googleBtn.addEventListener("click", () => {
 
  console.log("My Google Button");
 
  signInWithPopup(auth, provider)
   
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    window.location = "index.html";
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.error(errorMessage);
  });
 
})
