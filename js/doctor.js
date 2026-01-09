import { db } from "./firebase.js";
import { 
  collection, query, where, orderBy, limit, getDocs, updateDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* AUTH CHECK */
const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "doctor") { 
  location.href = "index.html"; 
}

// We identify the doctor by their 'name' stored during signup
const myName = user.name; 
document.getElementById("docNameDisplay").innerText = "Logged in as: " + myName;

let currentAppointmentId = null;

/* 1. FILTERED WAITING COUNT */
// This listener only looks for patients assigned to 'myName'
const qCount = query(
  collection(db, "appointments"), 
  where("doctor", "==", myName), 
  where("status", "==", "waiting")
);

onSnapshot(qCount, (snapshot) => {
  document.getElementById("waitingCount").innerText = snapshot.size;
});

/* 2. FILTERED 'CALL NEXT' LOGIC */
async function callNext() {
  const q = query(
    collection(db, "appointments"),
    where("doctor", "==", myName), // Only my patients
    where("status", "==", "waiting"),
    orderBy("priority", "asc"),
    orderBy("createdAt", "asc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    alert("No more patients waiting specifically for you.");
    return;
  }

  const nextDoc = snapshot.docs[0];
  currentAppointmentId = nextDoc.id;
  const data = nextDoc.data();

  document.getElementById("currentPatientName").innerText = data.patientName;
  document.getElementById("currentTokenDisplay").innerText = "Token #" + data.tokenNumber;
  await updateDoc(doc(db, "appointments", currentAppointmentId), {
  status: "calling"
});

document.getElementById("consultStatus").innerText = "Calling...";

}

/* 3. START CONSULTATION (Same logic, linked to currentAppointmentId) */
async function startConsultation() {
  if (!currentAppointmentId) return alert("Please call a patient first!");
  
  await updateDoc(doc(db, "appointments", currentAppointmentId), { 
    status: "consulting" 
  });
  document.getElementById("consultStatus").innerText = "In Progress";
}

/* 4. END CONSULTATION (Same logic) */
async function endConsultation() {
  if (!currentAppointmentId) return;

  await updateDoc(doc(db, "appointments", currentAppointmentId), { 
    status: "completed" 
  });
  
  currentAppointmentId = null;
  document.getElementById("currentPatientName").innerText = "None";
  document.getElementById("currentTokenDisplay").innerText = "";
  document.getElementById("consultStatus").innerText = "Idle";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  location.href = "index.html";
}

window.callNext = callNext;
window.startConsultation = startConsultation;
window.endConsultation = endConsultation;
window.logout = logout;