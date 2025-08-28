import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginAdminPayload {
  user: User;
  token: string;
}

interface AuthAdminState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;

}
const initialState: AuthAdminState = {
 isAuthenticated: false,
  token: null,
  user: null,
}

export const authAdminSlice = createSlice({
    name:'authAdmin',
    initialState,
    reducers : {
        loginAdminSuccess:(state,action: PayloadAction<LoginAdminPayload>) => {
            const {user,token} = action.payload;

            state.isAuthenticated = true;
            state.token = token;
            state.user = user;
        },
        logoutAdmin: (state) =>{
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        }
    }

});

export const {loginAdminSuccess,logoutAdmin} = authAdminSlice.actions;
export default authAdminSlice.reducer;
