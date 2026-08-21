// import React from "react";
// import ReactDOM from "react-dom/client";
// import { ClerkProvider } from "@clerk/clerk-react";

// import App from "./App";
// import "./index.css";

// import {
//   AuthProvider,
//   WarehouseProvider,
//   InventoryProvider,
//   TransferProvider,
// } from "./context";

// const PUBLISHABLE_KEY =
//   import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error(
//     "Missing VITE_CLERK_PUBLISHABLE_KEY in .env"
//   );
// }

// ReactDOM.createRoot(
//   document.getElementById("root")
// ).render(
//   <React.StrictMode>
//     <ClerkProvider
//       publishableKey={PUBLISHABLE_KEY}
//       afterSignOutUrl="/login"
//     >
//       <AuthProvider>
//         <WarehouseProvider>
//           <InventoryProvider>
//             <TransferProvider>
//               <App />
//             </TransferProvider>
//           </InventoryProvider>
//         </WarehouseProvider>
//       </AuthProvider>
//     </ClerkProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "./App";
import "./index.css";

import {
  AuthProvider,
  WarehouseProvider,
  InventoryProvider,
  TransferProvider,
} from "./context";

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY"
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/login"
    >
      <AuthProvider>
        <WarehouseProvider>
          <InventoryProvider>
            <TransferProvider>
              <App />
            </TransferProvider>
          </InventoryProvider>
        </WarehouseProvider>
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);