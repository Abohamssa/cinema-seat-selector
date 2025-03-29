document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const seatMap = document.getElementById("seat-map");
  const selectedSeatsList = document.getElementById("selected-seats-list");
  const totalPriceElement = document.getElementById("total-price");
  const confirmBtn = document.getElementById("confirm-btn");
  const modal = document.getElementById("confirmation-modal");
  const closeModal = document.querySelector(".close-modal");
  const cancelBookingBtn = document.getElementById("cancel-booking");
  const confirmBookingBtn = document.getElementById("confirm-booking");
  const modalSeatCount = document.getElementById("modal-seat-count");
  const modalSeatList = document.getElementById("modal-seat-list");
  const modalTotalPrice = document.getElementById("modal-total-price");
  const notification = document.getElementById("notification");

  // Configuration
  const seatPrice = 12.99;
  const totalRows = 8;
  const seatsPerRow = 10;
  const wheelchairSeats = ["A1", "A2", "H9", "H10"]; // Example wheelchair accessible seats
  const occupiedSeats = ["A3", "B5", "B6", "C7", "D4", "E8", "F2", "G9", "H3"]; // Example occupied seats

  // State
  let selectedSeats = [];

  // Initialize seat map
  function initializeSeatMap() {
    seatMap.innerHTML = "";

    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.

      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = `${rowLetter}${seatNum}`;
        const seat = document.createElement("div");
        seat.className = "seat available";
        seat.textContent = seatNum;
        seat.dataset.seatId = seatId;

        // Mark wheelchair accessible seats
        if (wheelchairSeats.includes(seatId)) {
          seat.classList.add("wheelchair");
        }

        // Mark occupied seats
        if (occupiedSeats.includes(seatId)) {
          seat.classList.remove("available");
          seat.classList.add("occupied");
        }

        seat.addEventListener("click", toggleSeatSelection);
        seatMap.appendChild(seat);
      }
    }
  }

  // Toggle seat selection
  function toggleSeatSelection(e) {
    const seat = e.target;
    const seatId = seat.dataset.seatId;

    // Don't allow selection of occupied seats
    if (seat.classList.contains("occupied")) {
      return;
    }

    if (seat.classList.contains("selected")) {
      // Deselect seat
      seat.classList.remove("selected");
      seat.classList.add("available");
      selectedSeats = selectedSeats.filter((id) => id !== seatId);
    } else {
      // Select seat
      seat.classList.remove("available");
      seat.classList.add("selected");
      selectedSeats.push(seatId);
    }

    updateBookingSummary();
  }

  // Update booking summary
  function updateBookingSummary() {
    if (selectedSeats.length === 0) {
      selectedSeatsList.textContent = "None";
      totalPriceElement.textContent = "0";
      confirmBtn.disabled = true;
    } else {
      selectedSeatsList.textContent = selectedSeats.join(", ");
      const totalPrice = (selectedSeats.length * seatPrice).toFixed(2);
      totalPriceElement.textContent = totalPrice;
      confirmBtn.disabled = false;
    }
  }

  // Show confirmation modal
  function showConfirmationModal() {
    modalSeatCount.textContent = selectedSeats.length;
    modalSeatList.textContent = selectedSeats.join(", ");
    modalTotalPrice.textContent = (selectedSeats.length * seatPrice).toFixed(2);
    modal.style.display = "block";
  }

  // Close modal
  function closeConfirmationModal() {
    modal.style.display = "none";
  }

  // Confirm booking
  function completeBooking() {
    // In a real app, you would send this to your backend
    console.log("Booking confirmed for seats:", selectedSeats);

    // Show notification
    showNotification("Booking confirmed! Enjoy your movie.");

    // Mark seats as occupied
    selectedSeats.forEach((seatId) => {
      const seat = document.querySelector(`.seat[data-seat-id="${seatId}"]`);
      if (seat) {
        seat.classList.remove("selected");
        seat.classList.add("occupied");
      }
    });

    // Reset selection
    selectedSeats = [];
    updateBookingSummary();
    closeConfirmationModal();
  }

  // Show notification
  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = "block";

    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  // Event listeners
  confirmBtn.addEventListener("click", showConfirmationModal);
  closeModal.addEventListener("click", closeConfirmationModal);
  cancelBookingBtn.addEventListener("click", closeConfirmationModal);
  confirmBookingBtn.addEventListener("click", completeBooking);

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeConfirmationModal();
    }
  });

  // Initialize the seat map
  initializeSeatMap();
  updateBookingSummary();
});
