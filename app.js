import { onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth , db} from "./firebaseconfig.js"
import {  collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";;

// Getting elements from HTML

const form = document.querySelector('#form');
const todo = document.querySelector('#todo');
const div = document.querySelector('#container');
const logout = document.querySelector("#logout-btn")

// global array for todos
const allTodo = []
const renderData = 

// checking user status

onAuthStateChanged(auth,  (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    getDataFromFirestore()
  } else {
    window.location = "login.html"
  }
});


// logout user function

logout.addEventListener('click' , ()=>{
    signOut(auth).then(() => {
        console.log('logout sucessfully');
        window.location = 'login.html'

      }).catch((error) => {
        console.log(error);
        
      });
})

// console.log(auth);

// Getting data from database

async function getDataFromFirestore() {
  const q = query(collection(db, "Todos"), where("uid", "==", auth.currentUser.uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
      allTodo.push({
          ...doc.data(),
          docid: doc.id  // Ensure consistency with the field name here (docid).
      })
  });

  console.log(allTodo);

  // Create the HTML content outside the loop
  let listContent = '';
  allTodo.forEach(item => {
    listContent += `
    <div class="box">
      <li>${item.todo}</li> 
      <br>
      <button class="editBtn" id="edit">edit</button>
      <button class="deleteBtn" id="delete">delete</button>
    </div> 
    `;
  });

  // Insert the list content into the div
  div.innerHTML = listContent;

  // Select the delete and edit buttons again after the content is added to the DOM
  const deleteBtn = document.querySelectorAll('.deleteBtn');
  const editBtn = document.querySelectorAll('.editBtn');  

  // Handle delete button click
  deleteBtn.forEach((item, index) => {
    item.addEventListener('click', async () => {
      console.log("Delete button clicked");
      console.log(allTodo[index]);
      
      const docRef = doc(db, "Todos", allTodo[index].docid); // Use 'docid' here
      await deleteDoc(docRef);
      console.log('Todo deleted...');
      
      // Remove the item from the array and re-render
      allTodo.splice(index, 1);
      renderData(allTodo);
    });
  });

  // Handle edit button click
  editBtn.forEach((item, index) => {
    item.addEventListener('click', async () => {
      console.log("Edit button clicked");
      console.log(allTodo[index]);
      
      const updatedTitle = prompt("Enter updated title");
      
      if (updatedTitle) {
        const todoRef = doc(db, "Todos", allTodo[index].docid); // Use 'docid' here
        await updateDoc(todoRef, {
          todo: updatedTitle // Assuming the field name is 'todo'
        });
        console.log('Todo updated successfully');
        
        // Update the local data and re-render
        allTodo[index].todo = updatedTitle;
        renderData(allTodo);
      }
    });
  });
}


// adding data into database


form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log(todo.value)

  // console.log(auth);
  
  try {
    const docRef = await addDoc(collection(db, "Todos"), {
      todo: todo.value,
      uid: auth.currentUser.uid
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
  todo.value = ""
})
