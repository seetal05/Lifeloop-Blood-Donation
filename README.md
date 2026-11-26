# Lifeloop – Blood Donor Connection Platform

## About the Project

Lifeloop is a blood donor connection platform designed to help people find eligible blood donors based on blood group and location.

The platform aims to make donor discovery easier while protecting donor privacy through consent-based search functionality.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- Firebase Authentication
- Firebase Cloud Firestore
- Firebase Cloud Functions
- Firebase Admin SDK
- Firebase Emulator Suite
- Firebase App Check

## Project Structure

```text
Lifeloop/
│
├── functions/
│   ├── index.js
│   └── package.json
│
├── index.html
├── script.js
├── style.css
├── firebase.json
└── README.md
```

## Prerequisites

Install the following software:

- Node.js 24
- npm
- Git
- Visual Studio Code
- Firebase CLI

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd YOUR_PROJECT_FOLDER
```

### 3. Install Firebase Functions dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 5. Login to Firebase

```bash
firebase login
```

### 6. Select the Firebase project

```bash
firebase use --add
```

Select the Lifeloop Firebase project when prompted.

The Firebase project ID used by this application is:

```text
lifeloop-74cec
```

## Running the Project Locally

### Step 1: Start Firebase Emulators

Open a terminal in the main project directory (the directory containing `firebase.json`).

Run:

```bash
firebase emulators:start --only functions,firestore
```

This starts the local Firebase Functions and Firestore emulators.

### Step 2: Emulator Configuration

The emulator ports are configured in `firebase.json`.

| Firebase service | Local port |
|---|---:|
| Cloud Functions | 5001 |
| Cloud Firestore | 8080 |
| Emulator UI | 4000 |

The Emulator UI can be accessed at:

```text
http://127.0.0.1:4000
```

### Step 3: Start the Frontend

1. Open the project in Visual Studio Code.
2. Install the Live Server extension.
3. Open `index.html`.
4. Right-click and select **Open with Live Server**.

The application will open in your browser.

Keep the Firebase Emulator terminal running while testing the application.

### Step 4: Test Donor Registration

1. Open the donor registration form.
2. Enter the required donor details.
3. Select the donor's blood group.
4. Enter the city, locality and PIN code.
5. Provide consent for donor search.
6. Submit the registration form.

Donor records should be saved in the local Firestore Emulator.

### Step 5: Test Donor Search

1. Open the Search Donor section.
2. Select the required blood group.
3. Enter the city.
4. Enter the locality or PIN code.
5. Submit the search form.

The application calls the local Firebase Cloud Function through the Functions Emulator.

Only donors with `searchConsent: true` are included in search results.

## Firebase Configuration

The Firebase web application configuration is defined directly in `script.js`.

The application uses:

- Firebase Project ID: `lifeloop-74cec`
- Firebase Authentication configuration, if enabled elsewhere in the application
- Cloud Firestore
- Firebase Cloud Functions
- Firebase App Check with reCAPTCHA v3

The Firebase Functions configuration is defined in:

```text
functions/index.js
```

The emulator configuration is defined in:

```text
firebase.json
```

## Environment Variables

No `.env` environment variables are currently required by the supplied local-development configuration.

The Firebase web SDK configuration is defined in `script.js`.

The configuration includes:

- `apiKey`
- `authDomain`
- `databaseURL`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

These are Firebase client-side configuration values, not Firebase Admin private credentials.

The reCAPTCHA v3 site key is also configured in the frontend.

**Security note:** Firebase service account private keys, passwords, private tokens and other confidential credentials must never be committed to GitHub.

## Firebase App Check

Lifeloop uses Firebase App Check with the reCAPTCHA v3 provider.

A debug token can be used during local development.

If App Check reports an invalid debug token:

1. Check the browser developer console for the debug token.
2. Register the token in Firebase Console under App Check for the corresponding Firebase application.
3. Restart the local application if necessary.

Never publish debug tokens or use them as production credentials.

## Donor Search Functionality

The donor search functionality supports searching by:

- Blood group
- City
- Locality
- PIN code

The Cloud Function validates the search inputs and retrieves donor records from the `donors` Firestore collection.

Privacy protections include:

- Donor search consent verification.
- Filtering records using `searchConsent == true`.
- Limiting the initial database query to 100 records.
- Returning only blood group, city and locality information.

## Important Notes

- This repository is intended for local development and testing.
- Firebase Functions are executed using the local Firebase Emulator Suite.
- Firestore operations are directed to the local Firestore Emulator during local development.
- The Firestore Emulator starts with an empty database unless test data is imported or added.
- Use sample donor records for testing.
- The project does not currently provide a deployed production Cloud Function.
- A root-level `npm run dev` command is not configured. Use the Firebase Emulator command and Live Server instructions above.

## Troubleshooting

### Firebase Functions connection error

Make sure the Functions Emulator is running on port `5001`.

### Firestore connection error

Make sure the Firestore Emulator is running on port `8080`.

### No donor search results

Check:

- Blood group selection.
- City spelling.
- Locality or PIN code.
- Whether the donor has enabled search consent.

### App Check verification error

Check the reCAPTCHA configuration and local debug token registration.

### Dependency errors

Navigate to the `functions` directory and run:

```bash
npm install
```

---

### Environment Variables

Lifeloop currently does not require a separate `.env` file or environment variables for local frontend setup.

Firebase configuration and the reCAPTCHA v3 site key are configured directly in `script.js`.

For local development:
- Firebase App Check Debug Token is enabled on localhost.
- Firestore Emulator runs on port 8080.
- Firebase Functions Emulator runs on port 5001.

Users must configure their own Firebase project credentials and register their local App Check debug token when setting up their own environment.

No private service account credentials or Firebase Admin SDK secrets should be committed to the public repository.

**Lifeloop – Connecting blood donors with those in need.**
