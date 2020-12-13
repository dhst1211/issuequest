# IssueQuest
Issuequest is a website for finding issues you can solve.

## Description


### Features 

- You can check labeled issues from stared repositories at a glance.
- Besides stared repositories, you can check the labeled issues from repositories you have already contributed.

### Background

You probably heard that if you want to contribute to opensource, easiest way is starting with frameworks/library you are already familiar with. There are also labels like “good first issue”, “help wanted” to encourage newcomers to contribute. So you can star repositories you are interested in, and periodically check if there are new issues. 

But a problem with existing github’s stared repository list(https://github.com/yourname?tab=stars) is that you could not see whether those repositories have new issues labeled with “good first issue” or “help wanted”. You can also search issues by the label in github’s search box by typing something like “topic:python good-first-issues:>10”,  but it shows a bunch of repositories you are not familiar with.

So I made this website to quickly check if repositories you stared get new issues.
I hope this will reduce the time you are searching around issues and increase the time you are actually writing the code for the contribution.


## Installation

1. clone from github.

```
git clone https://github.com/dhst1211/issuequest.git
cd issuequest
npm isntall
cd client && npm install
cd ..
```

2. Set up [mongodb](https://docs.mongodb.com/manual/installation/).

3. Go to github and create new Oauth app. Authorization call back will be `http://localhost:4000/auth/github/callback`.
https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-an-oauth-app

4. Create [.env](https://github.com/motdotla/dotenv#readme) file in top level directory. (Use .env.example as a reference)
```
GITHUB_CLIENT_ID= // set client id you obtained when creating Oauth app in github.
GITHUB_CLIENT_SECRET= // set client secret you obtained when creating Oauth app in github.
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

MONGO_URL= // your mongodb url(https://docs.mongodb.com/manual/reference/connection-string/)

COOKIE_KEY= // you have to set random string for security

CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

5. Run `npm run dev`. Both backend and frontend will start.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)



