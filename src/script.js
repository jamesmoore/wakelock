console.clear();

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

// status paragraph
const statusElem = document.querySelector('#status h2');
// toggle button
const wakeButton = document.querySelector('[data-status]');
// checkbox
const reacquireCheck = document.querySelector('#reacquire');

// change button and status if wakelock becomes aquired or is released
const changeUI = (status = 'acquired') => {
  const acquired = status === 'acquired' ? true : false;
  wakeButton.dataset.status = acquired ? 'on' : 'off';
  wakeButton.textContent = `Turn wake lock ${acquired ? 'off' : 'on'}`;
  wakeButton.setAttribute('aria-pressed', acquired.toString());
  statusElem.textContent = `${acquired ? '✅' : '❌'} Wake lock ${acquired ? 'is active.' : 'has been released.'}`;
  statusElem.classList.remove('wake-on', 'wake-off');
  statusElem.classList.add(acquired ? 'wake-on' : 'wake-off');
  document.title = isStandalone
  ? acquired ? '✅ ON' : '❌ OFF'
  : acquired ? '✅ Wake lock on' : '❌ Wake lock off';
  reacquireCheck.disabled = !acquired;
}

// test support
let isSupported = false;

if ('wakeLock' in navigator) {
  isSupported = true;
  statusElem.textContent = 'Wake lock is supported.';
} else {
  wakeButton.disabled = true;
  reacquireCheck.disabled = true;
  statusElem.textContent = '⚠️ This browser does not support wake lock.';
}

if (isSupported) {
  // create a reference for the wake lock
  let wakeLock = null;

  reacquireCheck.disabled = true;

  // create an async function to request a wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');

      // change up our interface to reflect wake lock active
      changeUI();

      // listen for our release event
      wakeLock.onrelease = function(ev) {
        console.log(ev);
      }
      wakeLock.addEventListener('release', () => {
        // if wake lock is released alter the button accordingly
        changeUI('released');

      });

    } catch (err) {
      // if wake lock request fails - usually system related, such as battery
      wakeButton.dataset.status = 'off';
      wakeButton.textContent = 'Turn wake lock on';
      statusElem.textContent = `${err.name}, ${err.message}`;

    }
  } // requestWakeLock()

  // if we click our button
  wakeButton.addEventListener('click', () => {
    // if wakelock is off request it
    if (wakeButton.dataset.status === 'off') {
      requestWakeLock()
    } else { // if it's on release it
      wakeLock.release()
        .then(() => {
          wakeLock = null;
        })
    }
  })

  const handleVisibilityChange = () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  }

  const reacquireCheckHandler = () => {
    if (reacquireCheck.checked) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }

  reacquireCheck.addEventListener('change', reacquireCheckHandler);

  reacquireCheckHandler();
} // isSupported
