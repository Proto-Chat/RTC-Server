const socket = io.connect('your-server-url');
let yourID;
let userName;
let users = {};
let stream;
let receivingCall = false;
let caller;
let callerSignal;
let callAccepted = false;

const userVideo = document.getElementById('userVideo');
const partnerVideo = document.getElementById('partnerVideo');
const userNameSpan = document.getElementById('userName');
const incomingCallDiv = document.getElementById('incomingCall');
const userListDiv = document.getElementById('userList');
const hangUpButton = document.getElementById('hangUpButton');

// Similar logic to your React useEffect goes here for setting up socket events, getUserMedia, etc.

function callPeer(id) {
    // Logic to initialize a peer connection and handle signaling
}

function acceptCall() {
    // Logic to accept a call
}

function rejectCall() {
    // Logic to reject a call
}

function disconnectCall() {
    // Logic to disconnect a call
}

// Additional logic for updating UI and handling socket events
