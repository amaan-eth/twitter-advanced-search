let isOpenAIQuery = false;

/**
 * Create a dedicated keydown listener function for reuse
 * Will either submit the query to openai or twitter depending on the state of isOpenAIQuery
 * This helps to tell if its a new/edited query or a formatted query ready for twitter to use
 */
const keydownListener = (e) => {
  if (e.key === "Enter") {
    if (!isOpenAIQuery) {
      e.preventDefault();
      chrome.runtime.sendMessage({ message: "submitQuery", content: e.target.value });
    }
  } else {
    // If it's not 'Enter' and it's an alphabetic character, it means the user has started typing a new query
    let keyCode = e.keyCode;
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
      // ASCII codes for 'a-z' and 'A-Z'
      isOpenAIQuery = false;
    }
  }
};

/**
 * This listens for new "injectText" messages and will insert the content into the search bar
 */
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "injectText") {
    // Find all Twitter search inputs
    const elements = document.querySelectorAll('input[aria-label="Search query"]');
    if (!elements.length) return;

    // Loop through all elements and insert the content
    elements.forEach((element) => {
      // Inject the content into the search bar
      element.value = request.content;

      // Fire input event to let the page know the value has changed
      element.dispatchEvent(new Event("input", { bubbles: true }));

      // If the content is not "loading...", create and dispatch "Enter" key event
      if (request.content !== "loading...") {
        // Query has been transformed by OpenAI
        isOpenAIQuery = true;
      }
    });
  }
});

/**
 * This adds an event listener for all key strokes on the search input.
 * If the user presses "enter", it'll prevent the normal form submission & send a "submitQuery" message to your serviceWorker instead.
 */
const addListener = () => {
  const elements = document.querySelectorAll('input[aria-label="Search query"]');

  elements.forEach((element) => {
    // Check if listener has already been added by checking for our custom class
    if (element.classList.contains("eventListenerAdded")) return;

    // Add event listener
    element.addEventListener("keydown", keydownListener);

    // Add a class to mark this element as having the listener added
    element.classList.add("eventListenerAdded");
  });
};
addListener();

// Create a MutationObserver instance to watch for changes in the DOM
/**
 * The DOM changes a lot, so this is monitoring for changes & re-adds the even listener if the DOM changes
 * If a child node has been added or removed, it'll re-add the event listener
 */
const observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") addListener();
  }
});

// Start observing the document with the configured parameters
observer.observe(document, { childList: true, subtree: true });
