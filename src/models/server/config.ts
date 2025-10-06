import env from "@/app/env";

import { Client, Users, Avatars, Databases, Storage} from "node-appwrite";

let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) //  API Endpoint
    .setProject(env.appwrite.projectId) // Project ID
    .setKey(env.appwrite.apiKey); // API Key


const users = new Users(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { client, users, databases, avatars, storage };
