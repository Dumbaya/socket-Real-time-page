const IDLE_TIMEOUT = 5 * 60 * 1000;

let idleTimer = null;
let lastStartTime = null;

function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);

  lastStartTime = Date.now();

  idleTimer = setTimeout(() => {
    console.log("No clients. Shutting down.");
    process.exit(0);
  }, IDLE_TIMEOUT);
}

function getRemainingTime() {
  if (!lastStartTime) {
    return 0;
  }

  const elapsedTime = Date.now() - lastStartTime;
  const remainingTime = IDLE_TIMEOUT - elapsedTime;
  return Math.max(remainingTime, 0);
}

module.exports = { resetIdleTimer, getRemainingTime };
