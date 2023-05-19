# Search Twitter w/ Plain English

## ❗❗DISCLAIMERS❗❗
I saw some warning somewhere about it not being safe to store your openai api key in local storage. USE AT YOUR OWN RISK. I built this in 5 hours lol. The code is pretty small so it shouldn't be too difficult to read through in case you're worried about security.

## How to Use

1. Clone the repo
2. Go to chrome://extensions & turn on developer mode
3. Click "Load Unpacked" and select the folder you cloned
4. Pin or click on the extension icon & enter your OpenAI API key
5. Once it says "You entered your OpenAI API key" you're good to go
6. Go to twitter.com & search 10x faster :)

## How I Built This
This was my first chrome extension, so chatgpt helped a lot. I used [this site](https://blog.hootsuite.com/twitter-advanced-search/) as a launching pad. There's a section called "Searching Twitter on mobile" which has a table of how search queries should be structured. Then I used chatgpt to turn that into a csv format, edited it a bit to adhere to any twitter updates, and pasted that into the prompt.

The rest was relatively easy. I used [Buildspace's course](https://buildspace.so/builds/ai-writer) as a starting point for the chrome extension and just slowly iterated to get my desired functionality.

It was really satisfying getting it to inject text & override twitter's search bar.

### PRO TIP
Using chatgpt to write all the code for something you've never built before (in this case a chrome extension) can sometimes have you add a ton of code you don't understand. 

So... **pause & record a video of you explaining/commenting over the code so you can actually understand what's going on.** It allows you to make changes much faster bc you actually understand where the issues are.

## Socials
If you want to stay up to date w/ what I'm working on, you can check out [my Twitter](https://twitter.com/amaan_eth).

