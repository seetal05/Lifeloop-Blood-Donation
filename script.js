// ======================================
// 1. IMPORT FIREBASE LIBRARIES
// ======================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    connectFirestoreEmulator
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

import {
    getFunctions,
    httpsCallable,
    connectFunctionsEmulator
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-functions.js";
import {
    initializeAppCheck,
    ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app-check.js";
// ======================================
// 2. FIREBASE CONFIGURATION
// ======================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADMTisaPxQChYshQfpeLfzP6zs74k5rAg",
  authDomain: "lifeloop-74cec.firebaseapp.com",
  databaseURL: "https://lifeloop-74cec-default-rtdb.firebaseio.com",
  projectId: "lifeloop-74cec",
  storageBucket: "lifeloop-74cec.firebasestorage.app",
  messagingSenderId: "322066438443",
  appId: "1:322066438443:web:b4562e21ce09d695f64d6e",
  measurementId: "G-F8LTFEE3JS"
};


// ======================================
// 3. INITIALIZE FIREBASE
// ======================================

const app = initializeApp(firebaseConfig);

// App Check initialization
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6Lc81DIuAAAAAL9_Jimm3OIOLZdQ07xfCUxWfQwu"),
    isTokenAutoRefreshEnabled: true
});

// Firestore
const db = getFirestore(app);
connectFirestoreEmulator(db, "127.0.0.1", 8080);

// Functions
const functions = getFunctions(app);

// Connect to local Functions Emulator
connectFunctionsEmulator(
    functions,
    "127.0.0.1",
    5001
);

// Prepare secure donor search
const searchDonors = httpsCallable(
    functions,
    "searchDonors"
);

console.log("Lifeloop connected to Firebase!");
console.log("Firestore initialized!");
console.log("Functions Emulator connected!");

// ======================================
// 5. SELECT WEBSITE ELEMENTS
// ======================================

const donorButton = document.getElementById("donorButton");
const receiverButton = document.getElementById("receiverButton");

const donorForm = document.getElementById("donorForm");
const searchForm = document.getElementById("searchForm");

const homeSection = document.querySelector(".welcome-section");


// ======================================
// 6. SHOW DONOR REGISTRATION FORM
// ======================================

donorButton.addEventListener("click", function() {

    homeSection.classList.add("hidden");
    searchForm.classList.add("hidden");
    donorForm.classList.remove("hidden");

});


// ======================================
// 7. SHOW BLOOD SEARCH FORM
// ======================================

receiverButton.addEventListener("click", function() {

    homeSection.classList.add("hidden");
    donorForm.classList.add("hidden");
    searchForm.classList.remove("hidden");

});


// ======================================
// 8. BACK TO HOME BUTTONS
// ======================================

document.getElementById("backFromDonor")
.addEventListener("click", function() {

    donorForm.classList.add("hidden");
    homeSection.classList.remove("hidden");

});


document.getElementById("backFromSearch")
.addEventListener("click", function() {

    searchForm.classList.add("hidden");
    homeSection.classList.remove("hidden");

});


// ======================================
// 9. DONOR REGISTRATION WITH FIRESTORE
// ======================================

const registrationForm =
    document.getElementById("registrationForm");

registrationForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Collect donor information

    const donorData = {

        name: document.getElementById("donorName").value.trim(),

        bloodGroup: document.getElementById("donorBlood").value,

        city: document.getElementById("donorCity").value.trim(),

        locality: document.getElementById("donorLocality").value.trim(),

        pinCode: document.getElementById("donorPin").value.trim(),

        availability: document.getElementById("donorAvailability").value,

        searchConsent:
    document.getElementById("donorConsent").checked,
    createdAt: serverTimestamp()
    };


    // Save information to Firestore

    try {

        const docRef = await addDoc(
            collection(db, "donors"),
            donorData
        );

        console.log("Donor registered successfully!");
        console.log("Document ID:", docRef.id);

        alert(
            "Thank you, " + donorData.name +
            "! Your registration has been saved successfully."
        );

        registrationForm.reset();

    }

    catch(error) {

        console.error("Registration Error:", error);

        alert(
            "Registration failed. Please check your internet connection " +
            "and Firebase settings. See the Console for details."
        );

    }

});


// ======================================



// ======================================
// 10. DONOR SEARCH FUNCTIONALITY
// ======================================

// ======================================
// 10. SECURE DONOR SEARCH
// ======================================

const bloodSearchForm =
    document.getElementById("bloodSearchForm");

const donorResults =
    document.getElementById("donorResults");

bloodSearchForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const requiredBlood =
        document.getElementById("requiredBlood").value;

    const searchCity =
        document.getElementById("searchCity").value.trim();

    const searchLocation =
        document.getElementById("searchLocation").value.trim();

    donorResults.textContent = "Searching for donors...";

    try {

        // Call secure Firebase Cloud Function
        const response = await searchDonors({

            bloodGroup: requiredBlood,
            city: searchCity,
            location: searchLocation

        });

        // Receive only approved donor information
        const matchingDonors = response.data.donors || [];

        donorResults.replaceChildren();

        if (matchingDonors.length === 0) {

            const message = document.createElement("p");

            message.textContent =
                "Sorry! No matching donors found. Try another location.";

            donorResults.appendChild(message);

            return;
        }

        const heading = document.createElement("p");

        heading.textContent =
            matchingDonors.length + " matching donor(s) found.";

        donorResults.appendChild(heading);

        // Display permitted information only
        matchingDonors.forEach((donor) => {

            const card = document.createElement("div");

            card.className = "donor-card";

            const blood = document.createElement("p");

            blood.textContent =
                "Blood Group: " + donor.bloodGroup;

            const city = document.createElement("p");

            city.textContent =
                "City: " + donor.city;

            const locality = document.createElement("p");

            locality.textContent =
                "Locality: " + donor.locality;

            card.appendChild(blood);
            card.appendChild(city);
            card.appendChild(locality);

            donorResults.appendChild(card);

        });

    }

    catch(error) {

        console.error("Secure Donor Search Error:", error);

        donorResults.textContent =
            "Unable to search donors right now. Please try again.";

    }

});