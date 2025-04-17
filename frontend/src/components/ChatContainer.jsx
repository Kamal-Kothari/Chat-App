import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import ChatHeader from './ChatHeader.jsx'
import MessageInput from './MessageInput.jsx'
import MessageSkeleton from './skeleton/MessageSkeleton.jsx'

const ChatContainer = () => {
  const { selectedUser, getMessages, messages, isMessagesLoading } = useChatStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser._id, getMessages])

  if (isMessagesLoading) {
    return (
      <div className='flex flex-col flex-1 overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }
  return (
    <div className='flex flex-col flex-1 overflow-auto'>
      <ChatHeader />
      <p>messages ...</p>
      <MessageInput />
    </div>
  )
}

export default ChatContainer