// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import { Users } from "lucide-react";

// const Sidebar = () => {
//   const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
//     useChatStore();

//   const { onlineUsers } = useAuthStore();
//   const [showOnlineOnly, setShowOnlineOnly] = useState(false);

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   const filteredUsers = showOnlineOnly
//     ? users.filter((user) => onlineUsers.includes(user._id))
//     : users;

//   if (isUsersLoading) return <SidebarSkeleton />;

//   return (
//     <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
//       <div className="border-b border-base-300 w-full p-5">
//         <div className="flex items-center gap-2">
//           <Users className="size-6" />
//           <span className="font-medium hidden lg:block">Contacts</span>
//         </div>
//         {/* TODO: Online filter toggle */}
//         <div className="mt-3 hidden lg:flex items-center gap-2">
//           <label className="cursor-pointer flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={showOnlineOnly}
//               onChange={(e) => setShowOnlineOnly(e.target.checked)}
//               className="checkbox checkbox-sm"
//             />
//             <span className="text-sm">Show online only</span>
//           </label>
//           <span className="text-xs text-zinc-500">
//             ({onlineUsers.length - 1} online)
//           </span>
//         </div>
//       </div>

//       <div className="overflow-y-auto w-full py-3">
//         {filteredUsers.map((user) => (
//           <button
//             key={user._id}
//             onClick={() => setSelectedUser(user)}
//             className={`
//               w-full p-3 flex items-center gap-3
//               hover:bg-base-300 transition-colors
//               ${
//                 selectedUser?._id === user._id
//                   ? "bg-base-300 ring-1 ring-base-300"
//                   : ""
//               }
//             `}
//           >
//             <div className="relative mx-auto lg:mx-0">
//               <img
//                 src={user.profilePic || "/avatar.png"}
//                 alt={user.name}
//                 className="size-12 object-cover rounded-full"
//               />
//               {onlineUsers.includes(user._id) && (
//                 <span
//                   className="absolute bottom-0 right-0 size-3 bg-green-500
//                   rounded-full ring-2 ring-zinc-900"
//                 />
//               )}
//             </div>

//             {/* User info - only visible on larger screens */}
//             <div className="hidden lg:block text-left min-w-0">
//               <div className="font-medium truncate">{user.fullName}</div>
//               <div className="text-sm text-zinc-400">
//                 {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//               </div>
//             </div>
//           </button>
//         ))}

//         {filteredUsers.length === 0 && (
//           <div className="text-center text-zinc-500 py-4">No online users</div>
//         )}
//       </div>
//     </aside>
//   );
// };
// export default Sidebar;

//2

// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import { Users, Search, X } from "lucide-react";

// const Sidebar = () => {
//   const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
//     useChatStore();
// const { onlineUsers } = useAuthStore();
//   const [showOnlineOnly, setShowOnlineOnly] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);

//   // Filter users based on search query and online status
//   const filteredUsers = users
//     .filter((user) => !showOnlineOnly || onlineUsers.includes(user._id))
//     .filter((user) =>
//       user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aOnline = onlineUsers.includes(a._id);
//       const bOnline = onlineUsers.includes(b._id);
//       if (aOnline !== bOnline) return bOnline ? 1 : -1;

//       // Calculate match score based on character-by-character matching
//       const calculateMatchScore = (name) => {
//         let score = 0;
//         for (let i = 0; i < searchQuery.length; i++) {
//           if (name[i]?.toLowerCase() === searchQuery[i]?.toLowerCase()) {
//             score++;
//           } else {
//             break;
//           }
//         }
//         return score;
//       };

//       const aScore = calculateMatchScore(a.fullName);
//       const bScore = calculateMatchScore(b.fullName);

//       if (aScore !== bScore) return bScore - aScore; // Sort by match score descending
//       return a.fullName.localeCompare(b.fullName); // Fallback: alphabetical
//     });

//   if (isUsersLoading) return <SidebarSkeleton />;

//   return (
//     <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
//       <div className="border-b border-base-300 w-full p-4 space-y-3">
//         <div className="flex items-center gap-2">
//           <Users className="size-6" />
//           <span className="font-medium hidden lg:block">Contacts</span>
//         </div>

//         {/* Search Input */}
//         <div className="hidden lg:block relative">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search contacts..."
//             className="w-full px-3 py-2 bg-base-200 rounded-lg pr-8
//                      border border-base-300 focus:outline-none focus:border-primary
//                      transition-colors placeholder:text-zinc-500"
//           />
//           {searchQuery ? (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500
//                        hover:text-zinc-700 transition-colors"
//             >
//               <X className="size-4" />
//             </button>
//           ) : (
//             <Search className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
//           )}
//         </div>

//         {/* Filter Toggle */}
//         <div className="hidden lg:flex items-center justify-between">
//           <label className="cursor-pointer flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={showOnlineOnly}
//               onChange={(e) => setShowOnlineOnly(e.target.checked)}
//               className="checkbox checkbox-sm"
//             />
//             <span className="text-sm">Show online only</span>
//           </label>
//           <span className="text-xs text-zinc-500">
//             {onlineUsers.length - 1} online
//           </span>
//         </div>
//       </div>

//       <div className="overflow-y-auto w-full py-2">
//         {filteredUsers.map((user) => (
//           <button
//             key={user._id}
//             onClick={() => setSelectedUser(user)}
//             className={`
//               w-full p-3 flex items-center gap-3
//               hover:bg-base-200 transition-all duration-150
//               ${
//                 selectedUser?._id === user._id
//                   ? "bg-base-200 ring-1 ring-base-300"
//                   : ""
//               }
//             `}
//           >
//             <div className="relative mx-auto lg:mx-0">
//               <img
//                 src={user.profilePic || "/avatar.png"}
//                 alt={user.fullName}
//                 className="size-12 object-cover rounded-full border border-base-300"
//               />
//               {onlineUsers.includes(user._id) && (
//                 <span
//                   className="absolute bottom-0 right-0 size-3 bg-green-500
//                   rounded-full ring-2 ring-base-100"
//                 />
//               )}
//             </div>

//             {/* User info - only visible on larger screens */}
//             <div className="hidden lg:block text-left min-w-0 flex-1">
//               <div className="font-medium truncate">{user.fullName}</div>
//               <div
//                 className={`text-sm ${
//                   onlineUsers.includes(user._id)
//                     ? "text-green-500"
//                     : "text-zinc-500"
//                 }`}
//               >
//                 {onlineUsers.includes(user._id) ? "Online" : "Offline"}
//               </div>
//             </div>
//           </button>
//         ))}

//         {filteredUsers.length === 0 && (
//           <div className="text-center text-zinc-500 py-8 px-4">
//             {searchQuery
//               ? `No results found for "${searchQuery}"`
//               : showOnlineOnly
//               ? "No online contacts"
//               : "No contacts found"}
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

//3
import { useState, useRef, useEffect } from "react";
import { Users, Search, X, UserPlus, MessageCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function Sidebar() {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const modalRef = useRef(null);

  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers, friends, addFriend, getFriends } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsAddFriendOpen(false);
        setModalSearchQuery(""); // Clear modal search when closing
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getUsers();
    getFriends();
  }, [getUsers]);

  const getFilteredUsers = () => {
    const friendIds = friends.map((friend) => friend._id);
    let filtered = users.filter((user) => !friendIds.includes(user._id));

    if (modalSearchQuery) {
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(modalSearchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const getFilteredFriends = () => {
    let filtered = [...friends];

    if (sidebarSearchQuery) {
      filtered = filtered.filter((friend) =>
        friend.fullName.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
      );
    }

    if (showOnlineOnly) {
      filtered = filtered.filter((friend) => onlineUsers.includes(friend._id));
    }

    return filtered;
  };

  const addFriendIntoList = (user) => {
    addFriend(user);
    setTimeout(() => {
      getFriends();
      setModalSearchQuery(""); // Clear search after adding friend
    }, 800);
  };

  // Handle opening modal
  const handleOpenModal = () => {
    setIsAddFriendOpen(true);
    setModalSearchQuery(""); // Clear modal search when opening
  };

  return (
    <div>
      <aside className="h-full w-20 lg:w-80 border-r flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              <h2 className="font-semibold hidden lg:block text-gray-900 dark:text-white">
                Messages
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenModal()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <UserPlus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg 
                       border border-gray-200 dark:border-gray-700 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={sidebarSearchQuery}
              onChange={(e) => setSidebarSearchQuery(e.target.value)}
            />
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2">
            <input
              type="checkbox"
              id="onlineOnly"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="h-4 w-4 rounded-full  border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <label
              htmlFor="onlineOnly"
              className="text-sm text-gray-600 dark:text-gray-300 select-none"
            >
              Show online friends only
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {friends.length === 0 ? (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs">Click the plus icon to add friends</p>
              </div>
            ) : (
              <>
                {getFilteredFriends().map((friend) => (
                  <button
                    key={friend._id}
                    onClick={() => setSelectedUser(friend)}
                    className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      ${
                        selectedFriend?._id === friend._id
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                  >
                    <div className="relative">
                      <img
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {onlineUsers.includes(friend._id) && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
                      )}
                    </div>
                    <div className="hidden lg:block text-left min-w-0 flex-1">
                      <p className="font-medium truncate text-gray-900 dark:text-white">
                        {friend.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {onlineUsers.includes(friend._id)
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </button>
                ))}
                {getFilteredFriends().length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No matching friends found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {isAddFriendOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Friend
                </h3>
                <button
                  onClick={() => {
                    setIsAddFriendOpen(false);
                    setModalSearchQuery("");
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg 
                           border border-gray-200 dark:border-gray-700 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                />
              </div>

              <div className="overflow-y-auto max-h-[300px]">
                {getFilteredUsers().map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {onlineUsers.includes(user._id)
                            ? "Online"
                            : "Offline"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addFriendIntoList(user)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                               transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                ))}

                {getFilteredUsers().length === 0 && modalSearchQuery && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      No users found matching "{modalSearchQuery}"
                    </p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
