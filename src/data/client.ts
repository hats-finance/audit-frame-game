import { Db, MongoClient } from "mongodb";
import { config } from "@/config/config";
import { IEditSession } from "./models";
import { IHackerProfile } from "@hats.finance/shared";

class Database {
  client: Db;

  constructor() {
    if (!config.mongoDB.uri) throw new Error("'mongoDB.uri' env is not defined");
    const client = new MongoClient(config.mongoDB.uri);
    this.client = client.db(config.mongoDB.database);
  }

  getEditSessionsDb() {
    return this.client.collection<IEditSession>("editSessions");
  }

  getProfilesDb() {
    return this.client.collection<IHackerProfile>("profiles");
  }
}

export const db = new Database();
