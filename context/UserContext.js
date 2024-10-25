// import { createContext, useContext, useState, useEffect } from "react";

// // Create the UserContext
// const UserContext = createContext();

// // Provide the context
// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   // On mount, load the user from localStorage
//   useEffect(() => {
//     const storedUserInfo = localStorage.getItem("userInfo");
//     if (storedUserInfo) {
//       const parsedUser = JSON.parse(storedUserInfo);
//       setUser(parsedUser); // Set user info
//       setRole(parsedUser.role); // Set role info
//     }
//   }, []); // Empty dependency array ensures this runs once on mount

//   return (
//     <UserContext.Provider value={{ user, role, setUser, setRole }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// // Hook to use the user context
// export function useUser() {
//   return useContext(UserContext);
// }

import { createContext, useContext, useState, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// Provide the context
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null); // Add the user's name

  // On mount, load the user from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUser = JSON.parse(storedUserInfo);
      setUser(parsedUser); // Set user info
      setRole(parsedUser.role); // Set role info
      setName(parsedUser.name); // Set name info
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <UserContext.Provider
      value={{ user, role, name, setUser, setRole, setName }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the user context
export function useUser() {
  return useContext(UserContext);
}
