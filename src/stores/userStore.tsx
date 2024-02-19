import create from "zustand";

export type userInfo = {
  name: string;
  score: number;
  carType: string;
};

interface userStore {
  userInfo: userInfo | null;
  setUserInfo: (user: userInfo) => void;
}

const userStore = create<userStore>((set) => ({
  userInfo: null,
  setUserInfo: (user: userInfo) => {
    set(() => ({ userInfo: user }));
    console.log(user);
  }
}));

export default userStore;
