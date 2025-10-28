import { createSlice, nanoid } from '@reduxjs/toolkit';

// helpers
const createEmptyChat = (title) => {
    const id = nanoid();
    return { id, _id: id, title: title || 'New Chat', messages: [] };
};

const findChat = (state, chatId) => state.chats.find(c => c.id === chatId || c._id === chatId);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
        activeChatId: null,
        // the currently selected chat object (mirrors activeChatId)
        currentChat: null,
        // root messages array for the currently open chat (mirrors currentChat.messages)
        messages: [],
        isSending: false,
        input: ''
    },
    reducers: {
        ensureInitialChat(state) {
            if (state.chats.length === 0) {
                const chat = createEmptyChat();
                state.chats.unshift(chat);
                state.activeChatId = chat.id;
            }
        },
        startNewChat: {
            reducer(state, action) {
                const { _id, title } = action.payload;
                const id = _id || nanoid();
                state.chats.unshift({ _id: id, id, title: title || 'New Chat', messages: [] });
                state.activeChatId = id;
            }
        },
        selectChat(state, action) {
            state.activeChatId = action.payload;
            const chat = findChat(state, action.payload);
            state.currentChat = chat || null;
            state.messages = chat ? [...(chat.messages || [])] : [];
        },
        // set the current chat directly (accepts a chat id or a chat object)
        setCurrentChat(state, action) {
            const payload = action.payload;
            let chat = null;
            if (!payload) {
                state.currentChat = null;
                state.activeChatId = null;
                state.messages = [];
                return;
            }
            if (typeof payload === 'string') {
                chat = findChat(state, payload);
            } else if (payload && (payload.id || payload._id)) {
                // payload is a chat object
                chat = payload;
                // ensure chat exists in chats array
                const exists = state.chats.find(c => c.id === chat.id || c._id === chat._id);
                if (!exists) {
                    state.chats.unshift(chat);
                }
            }
            state.currentChat = chat || null;
            state.activeChatId = chat ? (chat.id || chat._id) : null;
            state.messages = chat ? [...(chat.messages || [])] : [];
        },
        setInput(state, action) {
            state.input = action.payload;
        },
        sendingStarted(state) {
            state.isSending = true;
        },
        sendingFinished(state) {
            state.isSending = false;
        },
        setChats(state, action) {
            state.chats = action.payload;
        },
        // Replace messages for a given chat (or for currentChat if chatId omitted)
        setMessages(state, action) {
            const { chatId, messages } = action.payload;
            const cid = chatId || (state.currentChat && (state.currentChat.id || state.currentChat._id));
            if (!cid) return;
            const chat = findChat(state, cid);
            if (chat) {
                chat.messages = messages || [];
            }
            if (state.currentChat && (state.currentChat.id === cid || state.currentChat._id === cid)) {
                state.currentChat = { ...(state.currentChat || {}), messages: messages || [] };
                state.messages = [...(messages || [])];
            }
        },
        // Generic message adder — keeps both chat.messages and root messages in sync
        addMessage(state, action) {
            const { chatId, message } = action.payload;
            const chat = findChat(state, chatId || (state.currentChat && (state.currentChat.id || state.currentChat._id)));
            if (!chat) return;
            chat.messages.push(message);
            if (state.currentChat && (state.currentChat.id === chat.id || state.currentChat._id === chat._id)) {
                state.messages.push(message);
                state.currentChat.messages = chat.messages;
            }
        },
        // Clear messages for a given chat (or current chat if omitted)
        clearMessages(state, action) {
            const chatId = action.payload;
            const cid = chatId || (state.currentChat && (state.currentChat.id || state.currentChat._id));
            if (!cid) return;
            const chat = findChat(state, cid);
            if (chat) chat.messages = [];
            if (state.currentChat && (state.currentChat.id === cid || state.currentChat._id === cid)) {
                state.currentChat.messages = [];
                state.messages = [];
            }
        },
        addUserMessage: {
            reducer(state, action) {
                const { chatId, message } = action.payload;
                const chat = findChat(state, chatId);
                if (!chat) return;
                if (chat.messages.length === 0) {
                    chat.title = message.content.slice(0, 40) + (message.content.length > 40 ? '…' : '');
                }
                chat.messages.push(message);
                if (state.currentChat && (state.currentChat.id === chat.id || state.currentChat._id === chat._id)) {
                    state.currentChat.messages = chat.messages;
                    state.messages.push(message);
                }
            },
            prepare(chatId, content) {
                return { payload: { chatId, message: { id: nanoid(), role: 'user', content, ts: Date.now() } } };
            }
        },
        addAIMessage: {
            reducer(state, action) {
                const { chatId, message } = action.payload;
                const chat = findChat(state, chatId);
                if (!chat) return;
                chat.messages.push(message);
                if (state.currentChat && (state.currentChat.id === chat.id || state.currentChat._id === chat._id)) {
                    state.currentChat.messages = chat.messages;
                    state.messages.push(message);
                }
            },
            prepare(chatId, content, error = false) {
                return { payload: { chatId, message: { id: nanoid(), role: 'ai', content, ts: Date.now(), ...(error ? { error: true } : {}) } } };
            }
        }
    }
});

export const {
    ensureInitialChat,
    startNewChat,
    selectChat,
    setCurrentChat,
    setInput,
    sendingStarted,
    sendingFinished,
    addUserMessage,
    addAIMessage,
    setChats,
    // new actions
    setMessages,
    addMessage,
    clearMessages
} = chatSlice.actions;

export default chatSlice.reducer;