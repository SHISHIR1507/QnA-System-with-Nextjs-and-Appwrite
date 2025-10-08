import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException, ID, Models} from "appwrite"
import { account } from "@/models/client/config";


export interface UserPrefs {
  reputation: number
}

interface IAuthStore {
  //4 data variables
  session: Models.Session | null;
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean


  //5 functions
  setHydrated(): void;

  verifySession(): Promise<void>;

  login(
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>

  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>


  logout(): Promise<void>

}


export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      //i defined the data variables as default like for the initial state
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      //now these 5 functns that'll modify the above data variables
      
      setHydrated() {
        set({hydrated: true})
      },

      async verifySession() {
        try {
          const session = await account.getSession("current")
          set({session})

        } catch (error) {
          console.log(error)
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password)
          const [user, {jwt}] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT()

          ])
          if (!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({
            reputation: 0
          })

          set({session, user, jwt})
          
          return { success: true}

        } catch (error) {

          console.log(error)
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      async createAccount(name:string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name)
          return {success: true}
        } catch (error) {
          console.log(error)
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      async logout() {
        try {
          await account.deleteSessions()
          set({session: null, jwt: null, user: null})
          
        } catch (error) {
          console.log(error)
        }
      },

    })),
    {
      name: "auth",
      onRehydrateStorage(){
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    }
  )
)