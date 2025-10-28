const { Server } = require("socket.io");
const cookies = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const messageModel = require("../models/message.model")
const aiService = require("../service/ai.service")
const  generateVector = require("../service/ai.service")
const { createMemory, queryMemory } = require("../service/vector.service")
const { use } = require("react");
// const { response, text } = require("express");
// const { response } = require("../app");



async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {})

  io.use(async (socket, next) => {

    const cookie = cookies.parse(socket.request.headers?.cookie || "");

     if(!cookie.token) {
       console.log("No cookie found");
       return next(new Error("No cookie found"));
     }

 try {

      const decoded = jwt.verify(cookie.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);
        

      socket.user = user;
      next();
    } catch (error) {
      console.error("JWT verification error:", error);
      next(new Error("Unauthorized"));
    }
  



    // const parsedCookies = cookies.parse(cookie || "");
    // console.log(parsedCookies);

   
  });

  io.on("connection", (socket) => {
   
     socket.on("ai-message", async(messagePayload) =>{

     
      // user message save database
      const message =   await messageModel.create({
      chat:messagePayload.chat,
       user:socket.user.id,
      content:messagePayload.content,
      role:"user"
    })
   
  const vectors = await aiService.generateVector(messagePayload.content);

  // console.log("generated vector :", vectors);
   
      const memory = await queryMemory({
      queryVector: vectors,
    limit: 3,
     metadata: {
      
      user: socket.user._id,

           }
  })


    await createMemory({
                vectors,
                messageId: message._id,
                metadata: { 
                  user: socket.user._id,
                   chat: messagePayload.chat,
                   text: messagePayload.content
                  },
            })

  

  // console.log(memory);
    // const generateVector = await aiService.generateVector(messageLoad.content);


                const   chatHistory = ( await messageModel.find({
      chat: messagePayload.chat
     }).sort({createdAt:-1}).limit(20).lean()).reverse()

        
  const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [ { text: item.content } ]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [ {
                        text: `

                        these are some previous messages from the chat, use them to generate a response

                        ${memory.map(item => item.metadata.text).join("\n")}
                        
                        ` } ]
                }
            ]


            const response = await aiService.generateResponse([ ...ltm, ...stm ])
    
      
    const responseVectors = await aiService.generateVector(response);


        const responseMessage = await messageModel.create({
         chat: messagePayload.chat,
         user: socket.user._id,
         content: response,
         text: response,
         role:"model"
       })


 await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: response
          }
        });

        // console.log("AI Response:", response);

        // Send the AI response back to the client that sent the message.
        // Frontend expects an "ai-response" event (see Frontend/src/pages/Home.jsx).
        try {
          socket.emit("ai-response", {
            content: response,
            chat: messagePayload.chat,
            messageId: responseMessage._id
          });
        } catch (emitErr) {
          console.error('Error emitting ai-response to client:', emitErr);
        }



 


      

          

      

          

  })



 


  
  });

  return io;
}


module.exports = initSocketServer;