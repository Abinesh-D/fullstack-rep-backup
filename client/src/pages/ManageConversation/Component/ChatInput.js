import React from 'react';
import { Row, Col, Button } from 'reactstrap';

const ChatInput = React.memo(({
  input,
  setInput,
  onKeyPress,
  handleSend,
  setIsDisable,
  typingContent,
  handleCancelTyping,
  inputRef,
  isDisable,
}) => {

  const onChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setIsDisable(value.trim() === '');
  };

  const isCancelMode = Boolean(typingContent);
  const isButtonDisabled = isDisable || (!input.trim() && !isCancelMode);

  return (
    <div className="p-3 chat-input-section">
      <Row>
        <Col>
          <div className="position-relative">
            <input
              type="text"
              value={input}
              onKeyPress={onKeyPress}
              onChange={onChange}
              className="form-control chat-input"
              placeholder="Ask me..."
              ref={inputRef}
            />
          </div>
        </Col>

        <Col className="col-auto">
          <Button
            type="button"
            color={isCancelMode ? "danger" : "primary"}
            onClick={isCancelMode ? handleCancelTyping : handleSend}
            className={`btn btn-${isCancelMode ? "danger" : "primary"} btn-rounded chat-send w-md`}
            disabled={!isCancelMode && isButtonDisabled}
          >
            <span className="d-none d-sm-inline-block me-2">
              {isCancelMode ? "Cancel" : "Send"}
            </span>
            <i className={`mdi mdi-${isCancelMode ? "close" : "send"}`} />
          </Button>
        </Col>
      </Row>
    </div>
  );
});

export default ChatInput;















// import React from 'react';
// import { Row, Col, Button } from 'reactstrap';

// const ChatInput = React.memo(({ input, setInput, onKeyPress, handleSend, setIsDisable, typingContent, handleCancelTyping, inputRef, isDisable }) => {
//   const onChange = (e) => {
//     const value = e.target.value;
//     setInput(value);
//     setIsDisable(false);
//   };

//   return (
//     <div className="p-3 chat-input-section">
//       <Row>
//         <Col>
//           <div className="position-relative">
//             <input
//               type="text"
//               value={input}
//               onKeyPress={onKeyPress}
//               onChange={onChange}
//               className="form-control chat-input"
//               placeholder="Ask me..."
//               ref={inputRef}
//             />
//           </div>
//         </Col>
//         <Col className="col-auto">
//           <Button
//             type="button"
//             color={typingContent ? "danger" : "primary"}
//             onClick={typingContent ? handleCancelTyping : handleSend}
//             className={`btn btn-${typingContent ? "danger" : "primary"} btn-rounded chat-send w-md`}
//             disabled={ isDisable}
//           >
//             <span className="d-none d-sm-inline-block me-2">
//               {typingContent ? "Cancel" : "Send"}
//             </span>
//             <i className={`mdi mdi-${typingContent ? "close" : "send"}`} />
//           </Button>
//         </Col>
//       </Row>
//     </div>
//   );
// });

// export default ChatInput;















// import { Row, Col, Button } from "reactstrap";

// const ChatInput = ({ input, setInput, onKeyPress, handleSend, setIsDisable, typingContent, handleCancelTyping }) => {

//     return (
//         <div className="p-3 chat-input-section">
//             <Row>
//                 <Col>
//                     <div className="position-relative">
//                         <input
//                             type="text"
//                             value={input}
//                             onKeyPress={onKeyPress}
//                             onChange={(e) => {
//                                 setInput(e.target.value);
//                                 setIsDisable(!!e.target.value.trim());
//                             }}
//                             className="form-control chat-input"
//                             placeholder="Ask me..."
//                         />
//                     </div>
//                 </Col>
//                 <Col className="col-auto">
//                     <Button
//                         type="button"
//                         color={typingContent ? "danger" : "primary"}
//                         onClick={typingContent ? handleCancelTyping : handleSend}
//                         className={`btn btn-${typingContent ? "danger" : "primary"} btn-rounded chat-send w-md`}
//                     >
//                         <span className="d-none d-sm-inline-block me-2">
//                             {typingContent ? "Cancel" : "Send"}
//                         </span>
//                         <i className={`mdi mdi-${typingContent ? "close" : "send"}`} />
//                     </Button>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default ChatInput;