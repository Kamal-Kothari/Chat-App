import { create } from 'zustand';
import axiosInstance from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:5001'; // Define the base URL for your API

// create(()=>({}))
export const useAuthStore = create((set, get) => ({
    authUser: null,
    // setAuthUser : (user) => set({authUser : user}),

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')  //missed await
            // baseUrl + /auth/check
            // baseUrl = http://localhost:5001/api
            set({ authUser: res.data });
            get().connectSocket(); // Call connectSocket after successful authentication check
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            set({ authUser: res.data });
            toast.success('Signup successful');
            get().connectSocket(); // Call connectSocket after successful signup
        } catch (error) {
            console.log(`error in signup : ${error}`);
            // toast.error('Signup failed');
            toast.error(error.response.data.message || 'Signup failed');
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', formData);
            set({ authUser: res.data });
            toast.success('Login successful');
            get().connectSocket(); // Call connectSocket after successful login
        } catch (error) {
            console.log(`error in login : ${error}`);
            // toast.error('Login failed');
            toast.error(error.response.data.message || 'Login failed');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logout successful');
            get().disconnectSocket(); // Call disconnectSocket after successful logout
        } catch (error) {
            console.log(`error in logout : ${error}`);
            toast.error('Logout failed');

        }
    },

    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', formData);// formData must have profilePic
            set({ authUser: res.data }); // response from backend will be available in res.data
            toast.success('Profile updated successfully');
        } catch (error) {
            console.log(`error in updateProfile : ${error}`);
            toast.error(error.response.data.message || 'Profile update failed');
        } finally {
            set({ isUpdatingProfile: false });
        }

    },

    connectSocket: () => {
        const authUser = get().authUser;
        if (!authUser || get().socket?.connected ) return; // Don't connect if not authenticated
        const socket = io(BASE_URL,{
            query: { userId: authUser._id }, // Pass userId as a query parameter
           
        });
        socket.connect();
        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers : userIds });
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) {
            get().socket.disconnect();
        }
        set({ socket: null });
        // const socket = io('http://localhost:5001');
        // socket.disconnect();
    },
}));