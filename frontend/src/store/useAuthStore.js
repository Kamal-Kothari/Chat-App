import {create} from 'zustand';
import axiosInstance from '../lib/axios.js';
import {toast} from 'react-hot-toast';

// create(()=>({}))
export const useAuthStore = create((set)=>({
    authUser : null,
    // setAuthUser : (user) => set({authUser : user}),

    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,

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
    },

    signup : async (formData) => {
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            set({authUser : res.data});
            toast.success('Signup successful');
        } catch (error) {
            console.log(`error in signup : ${error}`);
            // toast.error('Signup failed');
            toast.error(error.response.data.message || 'Signup failed');
        }finally{
            set({isSigningUp : false});
        }
    },
    
}))