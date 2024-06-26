# OrbisDB Chat Bot

Realtime chat using GraphQL Live Queries, Next.js, and OrbisDB.

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

5. Run the application:

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


