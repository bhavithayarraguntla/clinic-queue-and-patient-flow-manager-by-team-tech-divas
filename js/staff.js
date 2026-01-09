import { db } from "./firebase.js";
import { 
  collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "staff") { location.href = "index.html"; }

/* 1. ADD WALK-IN PATIENT WITH PRIORITY */
async function addPatient() {
  const name = document.getElementById("patientName").value;
  const doctor = document.getElementById("doctorSelect").value;
  const isEmergency = document.getElementById("emergency").checked;

  if (!name || !doctor) {
    alert("Please enter patient name and assign a doctor.");
    return;
  }

  try {
    // Determine Token Number (Count existing waiting patients for this doctor)
    const qCount = query(
      collection(db, "appointments"), 
      where("doctor", "==", doctor), 
      where("status", "==", "waiting")
    );
    const snapshot = await getDocs(qCount);
    const tokenNumber = snapshot.size + 1;

    // Save to Firestore
    await addDoc(collection(db, "appointments"), {
      patientName: name + " (Walk-in)",
      doctor: doctor,
      status: "waiting",
      priority: isEmergency ? 1 : 2, // Emergency = 1, Normal = 2
      tokenNumber: tokenNumber,
      createdAt: serverTimestamp()
    });

    alert(`Patient ${name} added as Token #${tokenNumber}`);
    document.getElementById("patientName").value = "";
    document.getElementById("emergency").checked = false;

  } catch (e) {
    console.error("Staff Action Error:", e);
  }
}

/* 2. REAL-TIME CLINIC MONITOR */
// Staff sees EVERYTHING that is not completed yet
const qMonitor = query(
  collection(db, "appointments"), 
  where("status", "in", ["waiting", "calling", "consulting"]),
  orderBy("createdAt", "desc")
);

onSnapshot(qMonitor, (snapshot) => {
  const list = document.getElementById("queueList");
  list.innerHTML = "";

  if (snapshot.empty) {
    list.innerHTML = "<p style='text-align:center; color:#999;'>Clinic queue is currently empty.</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    
    // Apply special styling for emergency
    const isEmergency = data.priority === 1;
    div.className = `queue-item ${isEmergency ? 'emergency-row' : ''}`;
    
    div.innerHTML = `
      <div>
        <strong style="font-size:15px;">${data.patientName}</strong>
        <div style="font-size:12px; color:#666;">
          Doc: ${data.doctor} | Token: #${data.tokenNumber}
        </div>
      </div>
      <div>
        <span class="status-tag ${data.status}">${data.status}</span>
        ${isEmergency ? '<br><span style="color:red; font-size:10px; font-weight:bold;">🚨 HIGH PRIORITY</span>' : ''}
      </div>
    `;
    list.appendChild(div);
  });
});

function logout() {
  localStorage.removeItem("loggedInUser");
  location.href = "index.html";
}

window.addPatient = addPatient;
window.logout = logout;