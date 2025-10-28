import React from 'react'
import ChatSidebar from './ChatSidebar'
import ChatMessages from './ChatMessages'
import ChatComposer from './ChatComposer'
import ChatMobileBar from './ChatMobileBar'
import './ChatLayout.css'

const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <ChatSidebar />

      <div className="chat-main">
        <ChatMessages />
        <ChatComposer />
      </div>

      <ChatMobileBar />
    </div>
  )
}

export default ChatLayout
