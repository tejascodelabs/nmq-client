import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";

import TokenCallListener from "./components/TokenCallListener";

// Lazy load all page components
const HomeScreen = lazy(() => import("./pages/HomeScreen"));
const ScanQRCode = lazy(() => import("./pages/ScanQRCode"));
const CheckToken = lazy(() => import("./pages/CheckToken"));
const ConfirmDetails = lazy(() => import("./pages/ConfirmDetails"));
const QueueStatus = lazy(() => import("./pages/QueueStatus"));
const FinalCall = lazy(() => import("./pages/FinalCall"));
const CustomerArrived = lazy(() => import("./pages/CustomerArrived"));
const TokenConfirmed = lazy(() => import("./pages/TokenConfirmed"));

// Listener sirf customer routes par active rahega
function CustomerLayout() {
  return (
    <>
      <TokenCallListener />
      <Outlet />
    </>
  );
}

// Optional: Replace this with a custom spinner or skeleton screen
function PageLoader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* CUSTOMER ROUTES */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/check-token" element={<CheckToken />} />
            <Route path="/details/:id" element={<ConfirmDetails />} />
            <Route path="/token-conform" element={<TokenConfirmed />} />
            <Route path="/queue-status" element={<QueueStatus />} />
          </Route>

          {/* In routes par bhi listener active nhi rahega */}
          <Route path="/scan-qr" element={<ScanQRCode />} />
          <Route path="/final-call" element={<FinalCall />} />
          <Route path="/arrived" element={<CustomerArrived />} />

          {/* DEFAULT ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}