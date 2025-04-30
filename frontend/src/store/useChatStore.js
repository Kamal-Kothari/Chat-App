import { create } from 'zustand';
import axiosInstance from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });

        } catch (error) {
            console.log(`error in getUsers : ${error}`);
            toast.error('Failed to fetch users for sidebar');
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (id) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${id}`);
            set({ messages: res.data });
        } catch (error) {
            console.log(`error in getMessages : ${error}`);
            toast.error('Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.on('message', (message) => {
                const isMessageSentFromSelectedUser = message.senderId === selectedUser._id;    // Check if the message is sent from the selected user, else we will end up adding the message to the chat of the selected user even if the message is sent from other user
                if (!isMessageSentFromSelectedUser) return;
                set({ messages: [...get().messages, message] });
            });
        }
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off('message');
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}));