/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
const Chatbox = ({ user, setUser, socket }) => {
  const chatContainerRef = useRef(null);
  const { SID } = user;
  const roomId = `room_${SID}`;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [emoji, setEmoji] = useState(false);
  const [media, setMedia] = useState(false);
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const openAdminPanel = async () => {
    setInterval(async () => {
      const response = await axios.get("http://localhost:3000/admin/getAdmins");
      setAdmins(response.data.admins);
      // console.log(admins)
    }, 1000);
    setTransfer(true);
  };
  const handleMediaPanel = async () => {
    setMedia(!media);
  };

  const closeAdminPanel = async () => {
    setTransfer(false);
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const buffer = new Uint8Array(arrayBuffer);
        socket.emit(
          "uploadFile",
          {
            file: buffer,
            fileName: file.name,
            fileType: file.type,
            roomId: roomId,
            token : sessionStorage.getItem("token"),
          },
          (status) => {
            console.log(status);
          }
        );
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.log("No file selected");
    }
    setMedia(false);
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socket;
      const token = sessionStorage.getItem("token");
      console.log(socket);
      console.log(token);
      socket.emit("joinRoom", { roomId: roomId, token: token });
      socketRef.current.on("message", async (messageObj) => {
        console.log(messageObj);
        setMessages((messages) => [...messages, messageObj]);
      });

      socketRef.current.on("fileUploaded", async (data) => {
        const { fileName, fileType, file, username , role } = data;
        console.log({ fileName, fileType, file, roomId , username , role});
        setMessages((messages) => [...messages, data]);
      });

      const getMessageHistory = async () => {
        const response = await axios.get(
          "http://localhost:3000/admin/getRoomHistory",
          { params: { roomId: roomId } }
        );
        console.log(
          "Admin chat panel",
          response.data.historyMessages,
          response.data.username,
          response.data
        );

        setMessages((messages) => [
          ...messages,
          ...response.data.historyMessages,
        ]);
      };
      getMessageHistory();
    }

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = () => {
    console.log("Microphone is on!!!")
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
    let recognitionList = new SpeechGrammarList()
    recognition.grammars = recognitionList

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      console.log(event);
      const speechResult = event.results[0][0].transcript;
      console.log('Speech result:', speechResult);
      setMessageInput(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsRecording(false); // Stop recording
    };

    recognition.start();
  };

  const stopRecording = () => {
    console.log('Speech recognition stopped');
  };


  const handleEmojiClick = (emojiData) => {
    setMessageInput(messageInput + emojiData.emoji);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      const time = new Date();
      const formattedTime =
        ("0" + time.getHours()).slice(-2) +
        " : " +
        ("0" + time.getMinutes()).slice(-2);

      socketRef.current.emit("adminMessage", {
        message: messageInput,
        roomId: roomId,
        token: sessionStorage.getItem("token"),
        time: formattedTime,
      });

      setMessageInput("");
    }
  };

  const handleClose = async () => {
    const token = sessionStorage.getItem("token");
    console.log("Leaving Room");
    socketRef.current.emit("leaveRoom", { roomId: roomId, token: token });
    setUser(null);
    navigate("/dashboard");
  };
  const handleTransfer = async (adminSID) => {
    const token = sessionStorage.getItem("token");
    console.log("inside handle Transfer", roomId, adminSID);
    socketRef.current.emit("leaveRoom", { roomId: roomId, token: token });
    socketRef.current.emit("transferRequest", { roomId, adminSID });
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <div
        className="chat-container h-64 flex-grow overflow-y-auto"
        ref={chatContainerRef}
      >
        <div className="text-sm">
          {messages.map((message, index) => {
            if (message.content) {
              return (
                message.content && (
                  <div key={index}>
                    {message && (
                      <div className="my-2 mx-4">
                        <div
                          className={`flex ${
                            message.role == "admin"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <span
                            className={`${
                              message.role == "admin"
                                ? " row bg-[#778da9] text-white "
                                : " bg-[#e0e1dd] text-black "
                            } text-black  rounded-md p-2 `}
                          >
                            {message.content}
                            <span
                              className={`${
                                message.role == "admin"
                                  ? "text-white"
                                  : "text-black"
                              } text-xs ml-5 `}
                            >
                              {message.time}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                    {message && message?.username == null && (
                      <div>{message.content}</div>
                    )}
                  </div>
                )
              );
            } else {
              const { fileType, fileName } = message;
              const fileContent = `data:${fileType};base64,${message.file}`;

              if (fileType.startsWith("image/")) {
                return (
                  <div key={index} className=" flex  justify-end ">
                  <div  className = {`flex flex-col   my-2  rounded-lg  p-2  ${
                    message.role == "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`} >
                      <img
                        src={`${fileContent}`}
                        alt={fileName}
                        className="w-[200px] h-[200px] h-auto bg-gray-100 rounded-lg p-2 "
                      />
                      <a
                        href={`data:${fileType};base64,${message.file}`}
                        download={fileName} 
                      >
                      {fileName}
                      </a>
                  </div>
                  </div>
                );
              } else if (fileType === "application/pdf") {
                const blob = new Blob([message.file], { type: fileType });
                const url = window.URL.createObjectURL(blob);
                return (
                  <div key={index} className=" flex  justify-end ">
                <div key={index} className = {`flex  flex-col  my-2  rounded-lg  p-2  ${
                  message.role == "admin"
                    ? "justify-end"
                    : "justify-start"
                }`}>
                  <a   href={url} download={fileName} >
                    <div  className="w-[100px] rounded-lg p-2 h-[100px] my-2 bg-gray-100 flex flex-col justify-center">
                      <img
                        alt={fileName}
                        className="h-auto w-[50px] h-[50px]"
                        src="/pdf.png"
                      />
                      <p>{fileName}</p>
                  </div>
                </a>
                </div>
                </div>)

              } else if (fileType.startsWith("text/")) {
                const blob = new Blob([message.file], { type: fileType });
                const url = window.URL.createObjectURL(blob);
                return (
                  <div key={index} className=" flex  justify-end ">
                <div key={index} className = {`flex  flex-col my-2  rounded-lg  p-2  ${
                  message.role == "admin"
                    ? "justify-end"
                    : "justify-start"
                }`}>
                <a   href={url} download={fileName} >
                  <div  className={`w-[100px]  rounded-lg p-2 h-[100px] my-2 bg-gray-100
                  `}>
                    <img
                      alt={fileName}
                      className=" h-auto w-[50px] h-[50px]"
                      src="/txt-file.png"
                    />
                    <p className="w-full">{fileName}</p>
                </div>
              </a>
              </div>
              </div>)
              } else {
                return <p key={index}>Unsupported file type: {fileName}</p>;
              }
            }
          })}
        </div>
        {media && (
          <div className="fixed flex flex-row w-full  bottom-20">
            <div className="flex flex-col mb-2 border-2 p-2 border-gray-100 rounded-lg overflow-hidden">
              <input type="file" onChange={handleFileUpload} />
              <div className="flex flex-row space-x-5 justify-end">
                <button
                  className="bg-gray-200 border-[1px] border-black text-black p-1 rounded-md m-2"
                  onClick={handleUpload}
                >
                  Upload
                </button>
                <button
                  className="bg-gray-200 border-[1px] border-black text-black p-1 rounded-md m-2"
                  onClick={() => setMedia(!media)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {emoji && (
          <div className="fixed flex flex-row w-full justify-start bottom-20">
            <div className="flex flex-col mb-2 border-W2 border-gray-100 rounded-lg overflow-hidden">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={400}
                open={emoji}
              />
            </div>
          </div>
        )}
      </div>
      {transfer && (
        <div className="flex flex-row w-full h-50 justify-end">
          <div className="flex flex-col mb-2 border-2 border-gray-100 w-56 bg-white">
            <p className="flex justify-end items-start  ">
              <button
                className=" text-white w-7 h-7 overflow-hidden  rounded-sm bg-red-600"
                onClick={closeAdminPanel}
              >
                x
              </button>
            </p>
            <h3 className=" flex justify-center items-center">
              Admin Transfer Panel
            </h3>
            {admins.map((admin) => {
              return (
                <button
                  key={admin.SID}
                  className={`block text-gray-500 ${
                    admin.SID && !admin.closed
                      ? "bg-blue-400 text-white hover:bg-blue-500"
                      : "bg-gray-300"
                  }  p-2 m-2 rounded-md`}
                  disabled={!admin.SID || admin.closed}
                  onClick={() => {
                    handleTransfer(admin.SID);
                  }}
                >
                  <div>{admin.username}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* {emoji && (
        <div className="flex flex-row w-full h-50 justify-start">
          <div className="fixed flex flex-col mb-2 border-2 border-gray-100 w-80 bg-white rounded-lg overflow-hidden">
          <EmojiPicker onEmojiClick={handleEmojiClick} width={320} height={400} open={emoji} /> 
          </div>
        </div>
      )} */}

      <div className="flex flex-row h-10 mt-2">
        <button
          className="flex justify-center items-center "
          onClick={() => setEmoji(!emoji)}
        >
          <img
            className=" flex items-end justify-center mx-2 h-[30px] w-[30px]"
            src="/happy.png"
          />
        </button>
        <button
          className="flex justify-center items-center "
          onClick={handleMediaPanel}
        >
          <img
            className=" flex items-end justify-center mx-2 h-[30px] w-[30px]"
            src="/paper-pin.png"
          />
        </button>
          <button type="button" onClick={() => setIsRecording(!isRecording)} className="text-black p-2">
            {isRecording ? <img
            className=" flex items-end justify-center mx-2 h-[30px] w-[30px]"
            src="/microphone.png"
          /> : <img
          className=" flex items-end justify-center mx-2 h-[30px] w-[30px]"
          src="/mute.png"
        /> }
          </button>
        <form
          action=""
          className="flex flex-row h-10 w-full"
          onSubmit={onSubmit}
        >
          <input
            name="chatInput"
            type="text"
            placeholder="Type a message..."
            onChange={(e) => setMessageInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={messageInput}
          />

          

          <button
            className="text-white mx-4 rounded-lg ml-2 "
            onClick={onSubmit}
          >
            <img src="send.png" className="h-[30px] w-[30px] " />
          </button>
        </form>
        <button
          className=" text-white mx-4 rounded-lg ml-2"
          onClick={handleClose}
        >
          <img src="/logout.png" className="h-[30px] w-[30px] " />
        </button>
        <button
          className=" text-white mx-4  rounded-lg ml-2"
          onClick={openAdminPanel}
        >
          <img src="transfer.png" className="h-[30px] w-[30px] " />
        </button>
      </div>
    </>
  );
};
export default Chatbox;
