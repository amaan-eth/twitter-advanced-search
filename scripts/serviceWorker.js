// Function to get + decode API key
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-key"], (result) => {
      if (result["openai-key"]) {
        const decodedKey = atob(result["openai-key"]);
        resolve(decodedKey);
      }
    });
  });
};

// Function to send message to active tab
const injectText = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;
    chrome.tabs.sendMessage(activeTab, { message: "injectText", content });
  });
};

// Function to generate response from OpenAI API
const generate = async (prompt) => {
  const key = await getKey();
  const url = "https://api.openai.com/v1/chat/completions";

  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  const completion = await completionResponse.json();

  return completion.choices.pop();
};

// This is the core function. Calls openai w the prompt & query & returns the formatted query
const generateCompletionAction = async (query) => {
  try {
    // Send mesage with generating text (this will be like a loading indicator)
    injectText("loading...");

    const currentDate = new Date().toISOString().split("T")[0];

    const basePrompt = `Below is a CSV of example rules for Twitter's advanced search. You can write a query with these specific syntax rules and it will give more specific results: 

    Example Search Query,Explanation
    """phone book""","Searches for the exact phrase ""phone book"" within a tweet. Combines "phone" and "book" together into one string. Must be together in one string!"
    """phone"" ""book""","Searches for both the words ""phone"" and ""book"" within a tweet, but does not need to be together"
    (cats OR dogs),"Searches for either ""cats"" or ""dogs"" (or both)"
    coin -crypto,Searches for “coin” but not “crypto”
    (#mfm),Searches for the hashtag #mfm
    lang:es,Searches for tweets in Spanish
    (from:hootsuite),Searches tweets from the Hootsuite account
    (to:hootsuite),Searches all tweets written in reply to the Hootsuite account
    (@hootsuite),Searches for Twitter mentions of the Hootsuite account
    min_retweets:1000,"Searches for tweets with a minimum of 1,000 retweets"
    min_faves:1000,"Searches for tweets with a minimum of 1,000 likes"
    min_replies:1000,"Searches for tweets with a minimum of 1,000 replies"
    filter:replies,Searches only for tweets that are replies
    filter:links,Searches only for tweets with links included
    until:2021-02-01,Searches for tweets up until Feb 1st 2021
    since:2020-02-03,Searches for tweets after Feb 3rd 2020
    influencer filter:media,Searches for the word “influencer” and an image or video
    social url:hootsuite,Searches for tweets with the word “social” and a URL with the word “hootsuite” within it
    hootsuite since:2015-12-21 until:2016-01-21,"Search for tweets with the word “hootsuite” between December 21, 2015 and January 21, 2016.You can use the since: and until: parameters independent of each other, too."
    
    ---
    
    Based on these examples, I want you to give me a search query I can input to Twitter based on my request. Do not respond with anything besides the search query. I don't need any explanations. The current date is ${currentDate}
    
    Request: ${query}`;

    const completion = await generate(basePrompt);

    injectText(completion.message.content);
  } catch (error) {
    console.log(error);
    injectText(error.toString());
  }
};

// Listens for "submitQuery" messages and calls OpenAI's API with your prompt & input text
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "submitQuery") {
    generateCompletionAction(request.content);
  }
});
