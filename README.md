# OrbisDB Chat Bot

Realtime chat using OpenAI, Next.js, and OrbisDB.

## Getting Started

1. Install your dependencies:

```bash
npm install
```

2. Copy the [env example](.env.example) file and rename it `.env`

3. Create a WalletConnect project ID by visiting https://cloud.walletconnect.com/sign-in, create a new project (with a name of your choosing and the `App` type selected), and copy the `Project ID` key once available. 

Once copied, assign it to `NEXT_PUBLIC_PROJECT_ID` in your .env file

4. Visit [OpenAI's API Signup](https://platform.openai.com/signup) page to create an account if you don't yet have one and generate an API key.

At the time of writing this tutorial, OpenAI is offering a free OpenAI API trial, with $5 worth of credit (which can take you a LONGGG way).

Include in your .env file:

`OPENAI_API_KEY="sk-thisisabunchofL3ttersandNum8ers"`

5. Visit the [Orbis Studio](https://studio.useorbis.com/) and create a free account if you do not already have one. 

First, set up a new context (required to use a shared instance). Assign this to `NEXT_PUBLIC_CONTEXT_ID` in your .env file.

Next, navigate to the [model builder](https://studio.useorbis.com/models) view and use the [table reference](models/tables.sql) to define your tables. Use the corresponding model IDs to assign to `NEXT_PUBLIC_POST_ID` and `NEXT_PUBLIC_PROFILE_ID` in your .env file.

Finally, click the "Contexts" tab in the studio navbar and copy your environment ID from the left-hand side of the screen. Assign the value to `NEXT_PUBLIC_ENV_ID` in your .env file.

6. Run the application:

#### Development
```bash
nvm use 20
npm run dev
```

## Learn More

To learn more about OrbisDB please visit the following links

- [OrbisDB Overview](https://developers.ceramic.network/docs/orbisdb/overview) 
- [OrbisDB SDK](https://developers.ceramic.network/docs/orbisdb/orbisdb-sdk) 
- [OrbisDB Website](https://useorbis.com/) 

## Credit

Credit to [ChatBase](https://github.com/notrab/chatbase) for an awesome template to work with.


