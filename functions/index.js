const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin
initializeApp();

const db = getFirestore();

// Control the maximum number of running instances
setGlobalOptions({
    maxInstances: 5
});

// ======================================
// SECURE DONOR SEARCH
// ======================================

exports.searchDonors = onCall(
    {
        enforceAppCheck: true
    },
    async (request) => {

        // Validate search request
        const bloodGroup = request.data?.bloodGroup;
        const city = request.data?.city;
        const location = request.data?.location;

        const validBloodGroups = [
            "A+", "A-", "B+", "B-",
            "AB+", "AB-", "O+", "O-"
        ];

        if (
            typeof bloodGroup !== "string" ||
            !validBloodGroups.includes(bloodGroup)
        ) {
            throw new HttpsError(
                "invalid-argument",
                "Please select a valid blood group."
            );
        }

        if (
            typeof city !== "string" ||
            city.trim().length < 2 ||
            city.trim().length > 100
        ) {
            throw new HttpsError(
                "invalid-argument",
                "Please enter a valid city."
            );
        }

        if (
            typeof location !== "string" ||
            location.trim().length < 2 ||
            location.trim().length > 100
        ) {
            throw new HttpsError(
                "invalid-argument",
                "Please enter a valid locality or PIN code."
            );
        }

        try {

            // Only retrieve donors who have consented
            const donorQuery = await db
                .collection("donors")
                .where("bloodGroup", "==", bloodGroup)
                .where("searchConsent", "==", true)
                .limit(100)
                .get();

            const searchCity = city.trim().toLowerCase();
            const searchLocation = location.trim().toLowerCase();

            const matchingDonors = [];

            donorQuery.forEach((document) => {

                const donor = document.data();

                const donorCity = String(donor.city || "")
                    .trim()
                    .toLowerCase();

                const donorLocality = String(donor.locality || "")
                    .trim()
                    .toLowerCase();

                const donorPin = String(donor.pinCode || "").trim();

                const cityMatches = donorCity === searchCity;

                const locationMatches =
                    donorLocality.includes(searchLocation) ||
                    donorPin === location.trim();

                if (cityMatches && locationMatches) {

                    // Return only consented information
                    matchingDonors.push({
                        bloodGroup: donor.bloodGroup,
                        city: donor.city,
                        locality: donor.locality
                    });

                }

            });

            return {
                success: true,
                donors: matchingDonors
            };

        } catch (error) {

            console.error("Donor search failed:", error);

            throw new HttpsError(
                "internal",
                "Unable to search donors right now."
            );

        }

    }
);