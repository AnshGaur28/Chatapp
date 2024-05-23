import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

function SingleChat() {
  const chatContainerRef = useRef(null);
  const jwt = sessionStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [media, setMedia] = useState(false);
  const [file, setFile] = useState(null);

  const activityRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const handleMediaPanel = async () => {
    setMedia(!media);
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
        socketRef.current.emit(
          "uploadFile",
          {
            file: buffer,
            fileName: file.name,
            fileType: file.type,
            roomId: `room_${socketRef.current.id}`,
            token: sessionStorage.getItem("token"),
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
      const socket = io("ws://localhost:3000");
      socketRef.current = socket;
      socket.emit("createRoom", sessionStorage.getItem("token"));
      socket.on("message", async (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socketRef.current.on("fileUploaded", async (data) => {
        const { fileName, fileType, file, username, role } = data;
        console.log({ fileName, fileType, file, username, role });
        setMessages((messages) => [...messages, data]);
      });

      socket.on("open", () => {
        console.log("WebSocket connection established.");
      });
      socket.on("activity", (name) => {
        activityRef.textContent = `${name} is typing`;
      });
    }

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      const time = new Date();
      const formattedTime =
        ("0" + time.getHours()).slice(-2) +
        " : " +
        ("0" + time.getMinutes()).slice(-2);
      socketRef.current.send({
        message: messageInput,
        token: jwt,
        time: formattedTime,
      });
    }
    setMessageInput("");
  };

  const handleEmojiClick = (emojiData) => {
    setMessageInput(messageInput + emojiData.emoji);
  };
  const handleClose = async () => {
    console.log("Leaving Room");
    socketRef.current.emit("clientLeaveRoom");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    navigate("/");
  };
  return (
    <>
      <div
        // style={{
        //   backgroundImage:
        //     "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Adjust the path as needed
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
        className="flex flex-col justify-center items-center min-h-screen bg-gray-200 p-4 flex-grow"
      >
        <h1 className="font-bold text-xl p-2 text-center">Client Chat</h1>
        <div
          // style={{
          //   backgroundImage:
          //     "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Adjust the path as needed
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
          className="bg-white w-1/2 h-full rounded-lg flex flex-col flex-grow p-3 shadow-2xl"
        >
          <div
            className="chat-container flex flex-col flex-grow h-64 overflow-y-auto"
            ref={chatContainerRef}
          >
            {messages.map((message, index) => {
              if (message.content) {
                return (
                  <div className="scroller-item text-md" key={index}>
                    {message && message.username && (
                      <div className="my-2 mx-4">
                        <div
                          className={`flex ${
                            message.role == "client"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <span
                            className={`${
                              message.role == "client"
                                ? " row bg-[rgb(226,255,195)] "
                                : "bg-gray-50 "
                            } text-black  rounded-md p-2 `}
                          >
                            {/* {message.username} : {message.content} */}
                            {message.content}

                            <span className="text-xs text-gray-600 ml-5">
                              {message.time}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                    {message && message.username == null && (
                      <div>{message.content}</div>
                    )}
                  </div>
                );
              } else {
                const { fileType, fileName, role } = message;
                const fileContent = `data:${fileType};base64,${message.file}`;

                if (fileType.startsWith("image/")) {
                  return (
                    <div
                      key={index}
                      className={`flex flex-row p-2 m-2 text-sm ${
                        role == "client" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex-col">
                        <img
                          src={`${fileContent}`}
                          alt={fileName}
                          className=" w-20 h-20"
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
                    <div  
                      key={index}
                      className={`p-2 m-4 flex text-sm flex-row ${
                        message.role == "client"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col w-20">

                      <a href={url} download={fileName}>
                        <img
                          alt={fileName}
                          className="w-10 h-10"
                          src="/pdf.png"
                          />
                        <p>
                          {fileName.length > 12
                            ? fileName.substr(0, 12)
                            : fileName}
                          ...
                        </p>
                      </a>
                  </div>
                    </div>
                  );
                } else if (fileType.startsWith("text/")) {
                  const blob = new Blob([message.file], { type: fileType });
                  const url = window.URL.createObjectURL(blob);
                  return (
                    <div
                      key={index}
                      className={`p-2 mx-4 flex text-sm my-2 flex-row ${
                        message.role == "client"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col w-20">

                      <a href={url} download={fileName}>
                        <img
                          alt={fileName}
                          className="w-10 h-10"
                          src="/txt-file.png"
                          />
                        <p>
                          {fileName.length > 12
                            ? fileName.substr(0, 12)
                            : fileName}
                          ...
                        </p>
                      </a>
                            </div>
                    </div>
                  );
                } else {
                  return <p key={index}>Unsupported file type: {fileName}</p>;
                }
              }
            })}
            {media && (
              <div className="fixed flex flex-row bottom-20 bg-white">
                <div className="flex flex-col my-2 border-2 p-2 border-gray-100 rounded-lg overflow-hidden">
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
                <div className="flex flex-col mb-2 border-2 border-gray-100 rounded-lg overflow-hidden">
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
          {/* <div className="z-50 fixed bottom-20 right-65">
            {emoji && (
              <div className="z-50 flex flex-row w-full h-50 justify-end ">
                <div className="flex flex-col mb-2 border-2 border-gray-100 w-80 bg-white rounded-lg overflow-hidden">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={300} open={emoji} /> 
                </div>
              </div>
            )}
          </div> */}
          <div className="flex flex-row h-11 mt-2">
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
            <form
              action=""
              className="flex flex-row h-full w-full"
              onSubmit={onSubmit}
            >
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setMessageInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={messageInput}
              />

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                onClick={onSubmit}
              >
                Send
              </button>
            </form>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
              onClick={handleClose}
            >
              End
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleChat;
