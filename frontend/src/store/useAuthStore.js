import {create} from 'zustand';
import axiosInstance from '../lib/axios.js';
// create(()=>({}))
export const useAuthStore = create((set)=>({
    authUser : null,
    // setAuthUser : (user) => set({authUser : user}),

    isSigningUp : false,
    isLoggingIn : false,
    isUpdateingProfile : false,

    isCheckingAuth : true,

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get('/auth/check')  //missed await
                // baseUrl + /auth/check
            // baseUrl = http://localhost:5001/api
            set({authUser : res.data});
        } catch (error) {
            console.log(error);
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false});
        }
    }
    
}))