export const config = {
  apiURL: process.env.NEXT_PUBLIC_API_URL,
  hostURL: process.env.NEXT_PUBLIC_HOST_URL,
  env: process.env.NEXT_PUBLIC_ENV,
  mongoDB: {
    database: process.env.NEXT_PUBLIC_MONGO_DATABASE,
    uri: process.env.NEXT_PUBLIC_MONGO_URI,
  },
};
