## Tech Stack

**Server:** Node, discord.js


## Features

- Play list of songs by youtube random link.
    - /phatnhac [https://www.youtube.com/watch?v=[videoId]&list=RD[random_code]].
- Play by search term (only youtube) 
    - /phatnhac [search_term].
- Play a song by youtube or soundcloud link.
    - /phatnhac [url].
- Skip (/boqua)
- Pause (/tamdung)
- Resume (/tieptuc)
- Repeat (/laplai)
- Show current playing (/dangphat)
- Show current list (/danhsach)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`TOKEN` = Bot token

`uri` = Your mongodb uri or any type of mongodb database

`clientId` = Bot clientId

`guildId` = Your discord guildId 


## Run Locally (Linux System)

Clone the project

```bash
  git clone https://github.com/tieutrunghoa1198/music-bot.git
```

Go to the project directory

```bash
  cd music-bot
```

Install dependencies

```bash
  npm i
  or 
  npm install
```

Build project

```bash
  npm run build
```

Start the bot

```bash
  npm run start
```


## Authors

- [@tieutrunghoa1198](https://github.com/tieutrunghoa1198)



