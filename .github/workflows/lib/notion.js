const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN
});

const databaseId = process.env.NOTION_DATABASE_ID;
