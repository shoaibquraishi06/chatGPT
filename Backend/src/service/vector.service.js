const {Pinecone} = require('@pinecone-database/pinecone')


const pc = new Pinecone({ apiKey: "pcsk_5rKsoU_2BiosJTgSjvtrgbYEdkRgFCGuoyfCzCFhUBqSmge7pGabBBzfBqKEQXEAhPkUAe" });

const chatgptIndex = pc.Index('chatgpt');


async function createMemory({ vectors, metadata, messageId }) {
    await chatgptIndex.upsert([ {
        id: messageId,
        values: vectors,
        metadata
    } ])
}


async function queryMemory({queryVector, limit = 5, metadata }){

  const  data = await chatgptIndex.query({

    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata  : undefined,
     includeValues: false,
    includeMetadata: true,
  });

  return data.matches;


}


module.exports = {
    createMemory,
    queryMemory
}