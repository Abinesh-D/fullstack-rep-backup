import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveChatBoxData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
import './Conversation.css';
import ChatInput from './ChatInput';
import Bot3D from '../ReusableContent/Bot3D';
import TypingIndicator from '../ReusableContent/TypingIndicator';

const Conversation = () => {
  const dispatch = useDispatch();
  const chatData = useSelector(state => state.patentSlice.chatBoxData);

  const chatBoxRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [typingContent, setTypingContent] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [isFirstPromptSent, setIsFirstPromptSent] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isdisable, setIsDisable] = useState(true);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    inputRef.current?.focus();
    setIsFirstPromptSent(true);
    const userMessage = { role: 'USER', message: input };
    const updatedHistory = [...chatHistory, userMessage];

    setChatHistory(updatedHistory);
    setInput('');
    setIsDisable(true);
    setIsTyping(true);

    try {
      await dispatch(retrieveChatBoxData(input, dispatch));
    } catch (err) {
      console.error("Error:", err);
    }
  }, [input, chatHistory, dispatch]);

  const handleCancelTyping = useCallback(() => {
    clearInterval(typingIntervalRef.current);
    setTypingContent('');
    setShowTyping(false);
    setIsTyping(false);
    setIsDisable(true);
    inputRef.current?.focus();
  }, []);

  const onKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  useEffect(() => {
    if (chatData?.message?.content?.[0]?.text) {
      const fullText = chatData.message.content[0].text;
      let currentIndex = 0;

      setTypingContent('');
      setShowTyping(true);
      setIsTyping(false);

      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypingContent(prev => {
            const updated = prev + fullText.charAt(currentIndex);
            currentIndex++;
            return updated;
          });

        } else {
          clearInterval(typingIntervalRef.current);
          setTypingContent('');
          setShowTyping(false);
          setIsTyping(false);
          setChatHistory(prev => [
            ...prev,
            { role: 'CHATBOT', message: fullText }
          ]);
        }
      }, 10);

      return () => clearInterval(typingIntervalRef.current);
    }
  }, [chatData]);

  return (
    <div className="chat-container">
      <div className="d-flex align-items-center p-3 border-bottom">
        <h5 className="font-size-16 mb-0">Chat Bot</h5>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {chatHistory.length === 0 && !isFirstPromptSent && (
          <div className="text-center mt-5">
            <Bot3D />
            <p className="text-muted mt-3">Ask something to get started!</p>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role.toLowerCase()}`}>
            <div className="message-bubble">
              <div className="message-header">
                <strong>{msg.role === "USER" ? "You" : "AI Assistant"}</strong>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          </div>
        ))}

        {istyping && !showTyping && <TypingIndicator />}

        {showTyping && typingContent && (
          <div className="chat-message bot">
            <div className="message-bubble">
              <div className="message-header"><strong>AI Assistant</strong></div>
              <div className="message-content">
                {typingContent}
                <span className="typing-cursor">|</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onKeyPress={onKeyPress}
        handleSend={handleSend}
        isDisable={isdisable}
        setIsDisable={setIsDisable}
        typingContent={typingContent}
        handleCancelTyping={handleCancelTyping}
        inputRef={inputRef}
      />
    </div>
  );
};

export default Conversation;












// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { retrieveChatBoxData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
// import './Conversation.css';
// import ChatInput from './ChatInput';
// import Bot3D from '../ReusableContent/Bot3D';
// import TypingIndicator from '../ReusableContent/TypingIndicator';

// const Conversation = () => {
//   const dispatch = useDispatch();
//   const chatData = useSelector(state => state.patentSlice.chatBoxData);

//   const chatBoxRef = useRef(null);
//   const typingIntervalRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);



//   const [input, setInput] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [typingContent, setTypingContent] = useState('');
//   const [showTyping, setShowTyping] = useState(false);
//   const [isFirstPromptSent, setIsFirstPromptSent] = useState(false);
//   const [istyping, setIsTyping] = useState(false);
//   const [isdisable, setIsDisable] = useState(true);


//   const handleSend = useCallback(async () => {
//     if (!input.trim()) return;

//     setIsFirstPromptSent(true);
//     const userMessage = { role: 'USER', message: input };
//     const updatedHistory = [...chatHistory, userMessage];

//     setChatHistory(updatedHistory);
//     setInput('');
//     setIsDisable(false);
//     setIsTyping(true);

//     try {
//       await dispatch(retrieveChatBoxData(input, dispatch));
//     } catch (err) {
//       console.error("Error:", err);

//     }
//   }, [input, chatHistory, dispatch]);

//   const handleCancelTyping = useCallback(() => {
//     clearInterval(typingIntervalRef.current);
//     setTypingContent('');
//     setShowTyping(false);
//      setIsDisable(false);
//   }, []);

//   const onKeyPress = useCallback((e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   }, [handleSend]);

//   useEffect(() => {
//     if (chatData?.message?.content?.[0]?.text) {
//       const fullText = chatData.message.content[0].text;
//       let currentIndex = 0;
//       setTypingContent('');
//       setShowTyping(true);
//       setIsTyping(false);

//       typingIntervalRef.current = setInterval(() => {
//         if (currentIndex < fullText.length) {
//           setTypingContent(prev => {
//             const updated = prev + fullText.charAt(currentIndex);
//             currentIndex++;
//             return updated;
//           });

//           requestAnimationFrame(() => {
//             if (chatBoxRef.current) {
//               chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//             }
//           });

//         } else {
//           clearInterval(typingIntervalRef.current);
//           setTypingContent('');
//           setShowTyping(false);
//           setIsTyping(false);
//           setChatHistory(prev => [
//             ...prev,
//             { role: 'CHATBOT', message: fullText }
//           ]);
//         }
//       }, 10);

//       return () => clearInterval(typingIntervalRef.current);
//     }
//   }, [chatData]);

//   return (
//     <div className="chat-container">
//       <div className="d-flex align-items-center p-3 border-bottom">
//         <h5 className="font-size-16 mb-0">Chat Bot</h5>
//       </div>

//       <div className="chat-box" ref={chatBoxRef}>
//         {chatHistory.length === 0 && !isFirstPromptSent && (
//           <div className="text-center mt-5">
//             <Bot3D />
//             <p className="text-muted mt-3">Ask something to get started!</p>
//           </div>
//         )}

//         {chatHistory.map((msg, idx) => (
//           <div key={idx} className={`chat-message ${msg.role.toLowerCase()}`}>
//             <div className="message-bubble">
//               <div className="message-header">
//                 <strong>{msg.role === "USER" ? "You" : "AI Assistant"}</strong>
//               </div>
//               <div className="message-content">{msg.message}</div>
//             </div>
//           </div>
//         ))}

//         {istyping && !showTyping && <TypingIndicator />}

//         {showTyping && typingContent && (
//           <div className="chat-message bot">
//             <div className="message-bubble">
//               <div className="message-header"><strong>AI Assistant</strong></div>
//               <div className="message-content">
//                 {typingContent}
//                 <span className="typing-cursor">|</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <ChatInput
//         input={input}
//         setInput={setInput}
//         onKeyPress={onKeyPress}
//         handleSend={handleSend}
//         isDisable={isdisable}
//         setIsDisable={setIsDisable}
//         typingContent={typingContent}
//         handleCancelTyping={handleCancelTyping}
//         inputRef= {inputRef}
        
//       />
//     </div>
//   );
// };

// export default Conversation;














// import React, { useState, useEffect, useRef } from 'react';
// import { retrieveChatBoxData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
// import { useDispatch, useSelector } from 'react-redux';
// import './Conversation.css';
// import ChatInput from './ChatInput';
// import Bot3D from '../ReusableContent/Bot3D';
// import TypingIndicator from '../ReusableContent/TypingIndicator';


// const Conversation = () => {
//   const dispatch = useDispatch();
//   const chatData = useSelector(state => state.patentSlice.chatBoxData);
//   console.log('chatData', chatData)
//   const chatBoxRef = useRef(null);
//   const typingIntervalRef = useRef(null);

//   const [input, setInput] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [typingContent, setTypingContent] = useState('');
//   const [isdisable, setIsDisable] = useState(false);
//   const [showTyping, setShowTyping] = useState(false);
//   const [isFirstPromptSent, setIsFirstPromptSent] = useState(false);
//   const [istyping, setIsSettyping] = useState(false);


//   const handleSend = async () => {
//     if (!input.trim()) return;

//     setIsFirstPromptSent(true);
//     const userMessage = { role: 'USER', message: input };
//     const updatedHistory = [...chatHistory, userMessage];

//     setChatHistory(updatedHistory);
//     setInput('');
//     setIsDisable(false);
//     setIsSettyping(true);

//     try {
//       await dispatch(retrieveChatBoxData(input, dispatch));
//     } catch (err) {
//       console.error("Error:", err);
//       setIsSettyping(false);
//     }
//   };

//   const handleCancelTyping = () => {
//     clearInterval(typingIntervalRef.current);
//     setTypingContent('');
//     setShowTyping(false);
//     setIsSettyping(false);
//   };

//   const onKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   useEffect(() => {
//     if (chatData?.message?.content?.[0]?.text) {
//       const fullText = chatData.message.content[0].text;
//       let currentIndex = 0;
//       setTypingContent('');
//       setShowTyping(true);

//       typingIntervalRef.current = setInterval(() => {
//         if (currentIndex < fullText.length) {
//           setTypingContent(prev => prev + fullText.charAt(currentIndex));
//           currentIndex++;
//         } else {
//           clearInterval(typingIntervalRef.current);
//           setTypingContent('');
//           setShowTyping(false);
//           setIsSettyping(false);
//           setChatHistory(prev => [...prev, {
//             role: "CHATBOT",
//             message: fullText
//           }]);
//         }
//       }, 10);

//       return () => clearInterval(typingIntervalRef.current);
//     }
//   }, [chatData]);


//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [chatHistory, typingContent]);

//   return (
//     <div className="chat-container">
//       <div className="d-flex align-items-center p-3 border-bottom">
//         <h5 className="font-size-16 mb-0">Chat Bot</h5>
//       </div>

//       <div className="chat-box" ref={chatBoxRef}>
//         {chatHistory.length === 0 && !isFirstPromptSent && (
//           <div className="text-center mt-5">
//             <Bot3D />
//             <p className="text-muted mt-3">Ask something to get started!</p>
//           </div>
//         )}

//         {chatHistory.map((msg, idx) => (
//           <div key={idx} className={`chat-message ${msg.role.toLowerCase()}`}>
//             <div className="message-bubble">
//               <div className="message-header">
//                 <strong>{msg.role === "USER" ? "You" : "AI Assistant"}</strong>
//               </div>
//               <div className="message-content">{msg.message}</div>
//             </div>
//           </div>
//         ))}

//         {istyping && (
//           <TypingIndicator />
//         )}

//         {showTyping && typingContent && (
//           <div className="chat-message bot">
//             <div className="message-bubble">
//               <div className="message-header"><strong>AI Assistant</strong></div>
//               <div className="message-content">
//                 {typingContent}
//                 <span className="typing-cursor">|</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <ChatInput
//         input={input}
//         setInput={setInput}
//         onKeyPress={onKeyPress}
//         handleSend={handleSend}
//         isDisable={isdisable}
//         setIsDisable={setIsDisable}
//         typingContent={typingContent}
//         handleCancelTyping={handleCancelTyping}
//       />
//     </div>
//   );
// };

// export default Conversation;




















// import React, { useState, useEffect, useRef } from 'react';
// import { retrieveChatBoxData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
// import { useDispatch, useSelector } from 'react-redux';
// import './Conversation.css';
// import ChatInput from './ChatInput';

// const Conversation = () => {
//   const dispatch = useDispatch();
//   const chatData = useSelector(state => state.patentSlice.chatBoxData);
//   console.log('chatData', chatData)
//   const chatBoxRef = useRef(null);

//   const [input, setInput] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [typingContent, setTypingContent] = useState('');
//   const [isdisable, setIsDisable] = useState(false);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: 'USER', message: input };
//     const updatedHistory = [...chatHistory, userMessage];

//     setChatHistory(updatedHistory);
//     setInput('');
//     setIsDisable(false);

//     try {
//       await dispatch(retrieveChatBoxData(input, dispatch));
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   const onKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   useEffect(() => {
//     if (chatData?.message?.content?.[0]?.text) {
//       const fullText = chatData.message.content[0].text;
//       console.log('chatData.message', chatData.message)
//       let currentIndex = 0;
//       setTypingContent('');

//       const typingInterval = setInterval(() => {
//         if (currentIndex < fullText.length) {
//           setTypingContent(prev => prev + fullText.charAt(currentIndex));
//           currentIndex++;
//         } else {
//           clearInterval(typingInterval);
//           setChatHistory(prev => [...prev, {
//             role: "CHATBOT",
//             message: fullText
//           }]);
//           setTypingContent('');
//         }
//       }, 10);

//       return () => clearInterval(typingInterval);
//     }
//   }, [chatData]);

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [chatHistory, typingContent]);

//   return (
//     <div className="chat-container">
//       <div className="d-flex align-items-center p-3 border-bottom">
//         <h5 className="font-size-16 mb-0">Chat Bot</h5>
//       </div>

//       <div className="chat-box" ref={chatBoxRef}>
//         {chatHistory.map((msg, idx) => (
//           <div key={idx} className={`chat-message ${msg.role.toLowerCase()}`}>
//             <div className="message-bubble">
//               <div className="message-header">
//                 <strong>{msg.role === "USER" ? "You" : "AI Assistant"}</strong>
//               </div>
//               <div className="message-content">{msg.message}</div>
//             </div>
//           </div>
//         ))}

//         {typingContent && (
//           <div className="chat-message bot">
//             <div className="message-bubble">
//               <div className="message-header">
//                 <strong>AI Assistant</strong>
//               </div>
//               <div className="message-content">
//                 {typingContent}
//                 {typingContent && <span className="typing-cursor">|</span>}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <>
//         <ChatInput
//           input={input}
//           setInput={setInput}
//           onKeyPress={onKeyPress}
//           handleSend={handleSend}
//           isDisable={isdisable}
//           setIsDisable={setIsDisable}
//         />
//       </>
//     </div>
//   );
// };

// export default Conversation;













// import React, { useState, useEffect } from 'react';
// import { retrieveChatBoxData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
// import { useDispatch, useSelector } from 'react-redux';
// import './Conversation.css';

// const Conversation = () => {

//   const dispatch = useDispatch();
//   const chatData = useSelector(state => state.patentSlice.chatBoxData);
//   console.log('chatData :>> ', chatData);

//   const [input, setInput] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);


//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = [{ role: 'user', content: input }];
//     const updatedHistory = [...chatHistory, userMessage];

//     setChatHistory(updatedHistory);
//     setInput('');
//     setLoading(true);

//     try {
//       console.log('input :>> ', input);

//       await dispatch(retrieveChatBoxData(input, dispatch));
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };


// useEffect(() => {
//   if (chatData?.message?.content?.[0]?.text) {
//     const botMessage = {
//       role: "CHATBOT",
//       message: chatData.message.content[0].text,
//     };
//     setChatHistory((prev) => [...prev, botMessage]);
//     setLoading(false);
//   }
// }, [chatData]);

//   return (
//     <div className="chat-container">
//       <h2>Cohere AI Chat</h2>
//       <div className="chat-box">
//         {chatHistory.map((msg, idx) => (
//           <div key={idx} className={`message ${msg?.role?.toLowerCase()}`}>
//             <strong>{msg.role === "USER" ? "You" : "Bot"}:</strong> {msg.message}
//           </div>
//         ))}
//         {loading && <div className="message bot">Bot: Typing...</div>}
//       </div>
//       <div className="input-box">
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Ask me...!"
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Conversation;
