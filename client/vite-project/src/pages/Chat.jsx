// src/pages/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config/env";
import { toast } from "sonner";
import { ArrowLeft, Send, Video, Phone, MoreVertical, Search, Smile, Paperclip } from "lucide-react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar.jsx";


// Initialize socket
const socket = io(API_BASE_URL.replace("/api", ""), {
  autoConnect: false,
});

export default function Chat() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const [targetProfile, setTargetProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = user?.id || user?._id;

  // IMPORTANT: The room ID must be based on User IDs of both participants.
  // We cannot form the roomId until we have the target's actual User ID.
  const [roomId, setRoomId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);

  useEffect(() => {
    const fetchTargetProfile = async () => {
      setFetchingProfile(true);
      try {
        const token = await getAuthToken();
        const endpoint = user?.role === "therapist"
          ? `/api/users/${paramId}`
          : `/api/therapists/${paramId}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Profile not found: ${response.status}`);
        const data = await response.json();

        let profile = null;
        let resolvedOtherUserId = null;

        if (user?.role === "therapist") {
          profile = data.user;
          resolvedOtherUserId = profile._id;
        } else {
          profile = data;
          // For therapists, the actual User ID is stored in the 'user' field
          resolvedOtherUserId = profile.user?._id || profile.user;
        }

        setTargetProfile(profile);
        setOtherUserId(resolvedOtherUserId);

        if (userId && resolvedOtherUserId) {
          // Normalize to strings and lowercase to ensure identical sorting on both sides
          const idA = String(userId).toLowerCase().trim();
          const idB = String(resolvedOtherUserId).toLowerCase().trim();
          const generatedRoomId = [idA, idB].sort().join("_");
          setRoomId(generatedRoomId);
          console.log("Room ID generated:", generatedRoomId);
        }

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load conversation details");
      } finally {
        setFetchingProfile(false);
      }
    };

    if (userId && paramId) {
      fetchTargetProfile();
    }
  }, [paramId, user?.role, userId]);

  // Load chat history from backend
  useEffect(() => {
    if (!roomId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          const mappedMessages = data.map(msg => ({
            role: String(msg.sender?._id || msg.sender).toLowerCase().trim() === String(userId).toLowerCase().trim() ? "user" : "assistant",
            content: msg.message,
            fileUrl: msg.fileUrl,
            fileType: msg.fileType,
            fileName: msg.fileName,
            _id: msg._id
          }));
          setMessages(mappedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    fetchHistory();
  }, [roomId, userId]);

  // Socket connection and room joining
  useEffect(() => {
    if (!userId || !roomId) return;

    // Event listeners should be set BEFORE connecting/joining
    socket.off("receive_message");
    socket.on("receive_message", (data) => {
      const msgSenderId = data.sender?._id || data.sender;
      
      setMessages((prev) => {
        if (data._id && prev.some(m => m._id === data._id)) return prev;
        
        return [
          ...prev,
          {
            role: String(msgSenderId).toLowerCase().trim() === String(userId).toLowerCase().trim() ? "user" : "assistant",
            content: data.message,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            fileName: data.fileName,
            _id: data._id
          },
        ];
      });
    });

    socket.connect();
    socket.emit("join_room", roomId);

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [userId, roomId]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text, fileData = null) => {
    if ((!text && !fileData) || !userId || !otherUserId || !roomId) return;

    const messageData = {
      sender: String(userId).toLowerCase().trim(),
      receiver: String(otherUserId).toLowerCase().trim(),
      message: text,
      room: String(roomId).toLowerCase().trim(),
      fileUrl: fileData?.url,
      fileType: fileData?.type,
      fileName: fileData?.name,
    };

    socket.emit("send_message", messageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.prompt.value.trim();
    if (!input && !selectedFile) return;
    
    setLoading(true);
    try {
      let fileData = null;
      if (selectedFile) {
        // Convert to Base64
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve({
            url: reader.result,
            type: selectedFile.type,
            name: selectedFile.name
          });
          reader.onerror = error => reject(error);
        });
      }

      sendMessage(input, fileData);

      form.reset();
      setSelectedFile(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("File read error:", error);
      toast.error("Failed to process file attachment");
    } finally {
      setLoading(false);
    }
  };

  const addEmoji = (emoji) => {
    const input = document.getElementById("chat-input");
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = input.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      input.value = before + emoji + after;
      input.focus();
      // Reset cursor position
      const newPos = start + emoji.length;
      input.setSelectionRange(newPos, newPos);
    }
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.doc|\.docx)$/i;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedExtensions.exec(file.name) && !allowedMimeTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, PDF, and DOC are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    toast.success(`File ready: ${file.name}`);
  };

  const isTherapist = user?.role === "therapist";
  const displayName = isTherapist ? "Patient" : (targetProfile?.name || "...");
  const displayAvatar = isTherapist 
    ? "https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
    : (targetProfile?.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg");

  if (fetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-mindease-300 border-t-mindease-600"></div>
          <p className="text-mindease-600 mt-2">Connecting...</p>
        </div>
      </div>
    );
  }

  if (!targetProfile || !roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <p className="mb-4">Chat setup failed. Please try again.</p>
          <button onClick={() => navigate(-1)} className="text-blue-500">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-mindease-50 flex flex-col font-body">
      <Navbar />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-mindease-100 px-4 py-3 flex items-center justify-between sticky top-14 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-mindease-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-mindease-200"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 leading-tight text-sm sm:text-base">
                {displayName}
              </h1>
              <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                Active now
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 text-mindease-600 hover:bg-mindease-50 rounded-full transition">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-2 text-mindease-600 hover:bg-mindease-50 rounded-full transition">
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-mindease-50 rounded-full transition">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4 opacity-60">
            <div className="w-16 h-16 bg-mindease-100 rounded-full flex items-center justify-center text-mindease-500">
               <Send className="w-8 h-8" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">No messages yet</p>
              <p className="text-sm text-gray-500">Send a wave to start the conversation!</p>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div 
            key={m._id || i} 
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <ChatMessage 
              role={m.role} 
              content={m.content} 
              fileUrl={m.fileUrl}
              fileType={m.fileType}
              fileName={m.fileName}
              timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          </div>
        ))}
        <div ref={endRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-4 sm:p-6 bg-transparent sticky bottom-0 z-20">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="relative flex items-center gap-2 bg-white p-2 pl-4 rounded-2xl shadow-xl border border-mindease-100 transition-all focus-within:ring-2 focus-within:ring-mindease-400 focus-within:border-transparent"
          >
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-4 left-0 bg-white border rounded-2xl shadow-2xl p-4 grid grid-cols-6 gap-2 z-50 animate-float-in">
                {["😊", "😂", "🥰", "😎", "🤔", "😌", "🙏", "💪", "🌱", "✨", "💙", "🙌"].map(emoji => (
                  <button 
                    key={emoji} 
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 transition ${showEmojiPicker ? "text-mindease-500" : "text-gray-400 hover:text-mindease-500"}`}
            >
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className={`p-2 transition ${selectedFile ? "text-mindease-500" : "text-gray-400 hover:text-mindease-500"}`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex-grow relative">
              <input
                id="chat-input"
                name="prompt"
                type="text"
                placeholder={selectedFile ? `File: ${selectedFile.name}` : `Message ${displayName}...`}
                className="w-full py-2 px-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm sm:text-base border-none ring-0 focus:ring-0"
                autoComplete="off"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-mindease-500 to-accent-500 text-white p-3 rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium tracking-wide flex items-center justify-center gap-1 uppercase">
            <span className="w-1 h-1 bg-mindease-400 rounded-full"></span>
            End-to-end encrypted
            <span className="w-1 h-1 bg-mindease-400 rounded-full"></span>
          </p>
        </div>
      </div>
    </main>
  );
}
