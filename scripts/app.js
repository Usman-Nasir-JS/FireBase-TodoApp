import { onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth , db} from "./firebaseconfig.js"
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const form = document.querySelector('#form');
const todo = document.querySelector('#todo');
const div = document.querySelector('#container');
const logout = document.querySelector("#logout-btn");

const allTodo = [];

// ---------------- AUTH CHECK ----------------

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDataFromFirestore();
  } else {
    window.location = "login.html";
  }
});

// ---------------- LOGOUT ----------------

logout.addEventListener('click', async () => {
  await signOut(auth);
  window.location = "login.html";
});

// ---------------- GET DATA ----------------

async function getDataFromFirestore() {

  div.innerHTML = "<h2>Loading...!</h2>";

  const q = query(
    collection(db, "Todos"),
    where("uid", "==", auth.currentUser.uid)
  );

  const querySnapshot = await getDocs(q);

  allTodo.length = 0;

  querySnapshot.forEach((doc) => {
    allTodo.push({ ...doc.data(), docid: doc.id });
  });

  renderData(allTodo);
}

// ---------------- RENDER FUNCTION ----------------

function renderData(arr) {

  if (arr.length === 0) {
    div.innerHTML = "<h2>No Todo Found</h2>";
    return;
  }

  div.innerHTML = "";

  arr.forEach((item, index) => {
    div.innerHTML += `
      <div class="box">
        <br>
        <li>${item.todo}</li>
        <br />
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </div>
    `;
  });

  attachEvents();
}

// ---------------- EVENTS ----------------

function attachEvents() {

  const deleteBtn = document.querySelectorAll('.deleteBtn');
  const editBtn = document.querySelectorAll('.editBtn');

  deleteBtn.forEach((btn, index) => {
    btn.addEventListener('click', async () => {
      await deleteDoc(doc(db, "Todos", allTodo[index].docid));
      allTodo.splice(index, 1);
      renderData(allTodo);
    });
  });

  editBtn.forEach((btn, index) => {
    btn.addEventListener('click', async () => {
      const updated = prompt("Enter updated todo");
      if (!updated) return;

      await updateDoc(doc(db, "Todos", allTodo[index].docid), {
        todo: updated
      });

      allTodo[index].todo = updated;
      renderData(allTodo);
    });
  });

}

// ---------------- ADD TODO ----------------

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!todo.value.trim()) return;

  try {
    const docRef = await addDoc(collection(db, "Todos"), {
      todo: todo.value,
      uid: auth.currentUser.uid
    });

    // 🔥 realtime render fix
    allTodo.unshift({
      todo: todo.value,
      uid: auth.currentUser.uid,
      docid: docRef.id
    });

    renderData(allTodo);

  } catch (error) {
    console.log(error);
  }

  todo.value = "";
});
