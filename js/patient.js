import { db } from "./firebase.js";
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* AUTH DATA */
const user = JSON.parse(localStorage.getItem("loggedInUser"));
let currentDocId = null;

/* =========================
   REAL-TIME PATIENT LISTENER
   ========================= */
function startLiveUpdate(appointmentId) {
  const alertBox = document.getElementById("waitTimeDisplay");

  if (!alertBox) {
    console.error("❌ waitTimeDisplay element not found in patient.html");
    return;
  }

  onSnapshot(doc(db, "appointments", appointmentId), (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    console.log("PATIENT STATUS UPDATE:", data.status);

    if (data.status === "calling") {
      alertBox.innerText = "🔔 DOCTOR IS CALLING YOU! Please proceed to the room.";
      alertBox.style.color = "#dc3545";
    } 
    else if (data.status === "consulting") {
      alertBox.innerText = "⭐ IN CONSULTATION: The doctor is currently seeing you.";
      alertBox.style.color = "#28a745";
    } 
    else if (data.status === "completed") {
      alertBox.innerText = "✅ Consultation Finished. Have a great day!";
      alertBox.style.color = "#0a5ea5";
      setTimeout(() => location.reload(), 4000);
    }
  });
}

/* =========================
   GENERATE APPOINTMENT TOKEN
   ========================= */
async function generateToken() {
  const doctorName = document.getElementById("doctor").value;
  if (!doctorName) {
    alert("Please select a doctor");
    return;
  }

  try {
    // Count waiting patients for this doctor
    const q = query(
      collection(db, "appointments"),
      where("doctor", "==", doctorName),
      where("status", "==", "waiting")
    );

    const snapshot = await getDocs(q);
    const tokenNumber = snapshot.size + 1;

    // Create appointment
    const ref = await addDoc(collection(db, "appointments"), {
      patientName: user.name || user.username,
      username: user.username,
      doctor: doctorName,
      status: "waiting",
      tokenNumber: tokenNumber,
      createdAt: serverTimestamp(),
      priority: 2
    });

    currentDocId = ref.id;

    // Update UI
    document.getElementById("dName").innerText = doctorName;
    document.getElementById("token").innerText = "Token #" + tokenNumber;
    document.getElementById("tokenBox").style.display = "block";

    document.getElementById("waitTimeDisplay").innerText =
      "⏳ Please wait. You will be notified when the doctor calls you.";

    // Start real-time listener
    startLiveUpdate(currentDocId);

  } catch (error) {
    console.error("❌ Error generating token:", error);
  }
}

/* =========================
   CANCEL & LOGOUT
   ========================= */
window.generateToken = generateToken;

window.cancelAppointment = async () => {
  if (currentDocId && confirm("Cancel appointment?")) {
    await deleteDoc(doc(db, "appointments", currentDocId));
    location.reload();
  }
};

window.logout = () => {
  localStorage.removeItem("loggedInUser");
  location.href = "index.html";
};
