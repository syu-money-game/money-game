// document.addEventListener("DOMContentLoaded", () => {
//     // Constants for the observer and lever
//     const observer = document.querySelector(".observer-img");
//     const lever = document.querySelector(".lever");
//
//     // Set observer's initial position (for simplicity)
//     const observerPosition = observer.getBoundingClientRect();
//
//     // Function to simulate probabilistic detection
//     function detectLever() {
//         // Random probability (10% chance in this case)
//         const randomChance = Math.random();
//
//         // 10% 확률로 감시자가 주시함.
//         if (randomChance < 0.1) {
//             const leverPosition = lever.getBoundingClientRect();
//
//             // Check if the observer and lever are within a certain distance
//             if (isNear(observerPosition, leverPosition)) {
//                 console.log("Observer detected the lever!1");
//
//                 // Trigger some animation or action, for example:
//                 observer.style.transform = "scale(1.2)"; // Observer "reacting"
//                 setTimeout(() => {
//                     observer.style.transform = "scale(1)"; // Reset after reaction
//                 }, 500);
//
//                 // You could also change the observer's image or any other effect
//                 observer.src = "img/observer_active.png"; // Change observer image
//
//                 // Reset back after some time
//                 setTimeout(() => {
//                     observer.src = "img/observer.png"; // Reset observer image
//                 }, 2000);
//             }
//         }
//     }
//
//     // Function to check if the observer is near the lever
//     function isNear(observerPosition, leverPosition) {
//         const threshold = 100; // Distance threshold for detection in pixels
//
//         const distanceX = Math.abs(observerPosition.left - leverPosition.left);
//         const distanceY = Math.abs(observerPosition.top - leverPosition.top);
//
//         // If both X and Y distances are within the threshold
//         return distanceX < threshold && distanceY < threshold;
//     }
//
//     // Continuously check for lever detection with random intervals
//     setInterval(detectLever, 1000); // Check every second (adjust as needed)
// });
// document.addEventListener("DOMContentLoaded", () => {
//     // Constants for the observer and lever
//     const observer = document.querySelector(".observer-img");
//     const lever = document.querySelector(".lever");
//
//     // Set observer's initial position (for simplicity)
//     const observerPosition = observer.getBoundingClientRect();
//
//     // Function to simulate probabilistic detection
//     function detectLever() {
//         // Random probability (10% chance in this case)
//         const randomChance = Math.random();
//
//         // 10% 확률로 감시자가 주시함.
//         if (randomChance < 0.1) {
//             const leverPosition = lever.getBoundingClientRect();
//
//             // Check if the observer and lever are within a certain distance
//             if (isNear(observerPosition, leverPosition)) {
//                 console.log("Observer detected the lever!1");
//
//                 // Trigger some animation or action, for example:
//                 observer.style.transform = "scale(1.2)"; // Observer "reacting"
//                 setTimeout(() => {
//                     observer.style.transform = "scale(1)"; // Reset after reaction
//                 }, 500);
//
//                 // You could also change the observer's image or any other effect
//                 observer.src = "img/observer_active.png"; // Change observer image
//
//                 // Reset back after some time
//                 setTimeout(() => {
//                     observer.src = "img/observer.png"; // Reset observer image
//                 }, 2000);
//             }
//         }
//     }
//
//     // Function to check if the observer is near the lever
//     function isNear(observerPosition, leverPosition) {
//         const threshold = 100; // Distance threshold for detection in pixels
//
//         const distanceX = Math.abs(observerPosition.left - leverPosition.left);
//         const distanceY = Math.abs(observerPosition.top - leverPosition.top);
//
//         // If both X and Y distances are within the threshold
//         return distanceX < threshold && distanceY < threshold;
//     }
//
//     // Continuously check for lever detection with random intervals
//     setInterval(detectLever, 1000); // Check every second (adjust as needed)
// });