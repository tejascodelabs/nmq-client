import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdvertisementCarousel from "../components/AdvertisementCarousel";
import api from "../api/axios";
import backgroundImage from "../assets/background.png";
import SEO from "../components/SEO";

export default function CheckToken() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const mobileRegex = /^[6-9]\d{9}$/;
  const isValidMobile = mobileRegex.test(mobile);

  const handleCheck = async () => {
    if (loading) return;

    setError("");
    setInfoMessage("");
    setNotFound(false);

    if (!mobile.trim()) {
      return setError("Please enter your mobile number");
    }
    if (!mobileRegex.test(mobile.trim())) {
      return setError("Enter a valid 10-digit mobile number");
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/tokens/checkmytoken?mobile=${mobile.trim()}`,
      );
      const data = response.data;

      if (!data.success || !data.tokens || data.tokens.length === 0) {
        setNotFound(true);
        return;
      }

      const token = data.tokens[0];

      localStorage.setItem("currentTokenId", token.id);
      localStorage.setItem("currentMobile", token.mobile);
      localStorage.setItem(
        "currentShop",
        JSON.stringify({
          shopId: token.shopId,
          shopName: token.shopName || "Queue Shop",
        }),
      );

      if (token.status === "waiting") {
        navigate("/queue-status");
      } else if (token.status === "called") {
        navigate("/final-call", {
          state: {
            token,
            tokenId: token._id,
            mobile: token.mobile,
          },
        });
      } else if (token.status === "not_arrived") {
        setInfoMessage(
          "⚠️ You haven't arrived at the shop yet. Please wait for the current token to expire, then create a new token.",
        );
      } else if (token.status === "cancel") {
        setInfoMessage(
          "❌ Your token has been cancelled. Please generate a new token to join the queue.",
        );
      } else if (token.status === "arrived") {
        setInfoMessage(
          "✅ You have already received your table. Please enjoy your meal!",
        );
      } else if (token.status === "completed") {
        setInfoMessage(
          "✅ Your visit has been completed. Thank you for dining with us!",
        );
      } else {
        setInfoMessage("No Active Token Found");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      } else {
        setError(
          err.response?.data?.message || "Unable to connect. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Check My Token - Live Misal Queue Status & Wait Time"
        description="Check your live misal queue token number, current serving status, and estimated waiting time in real time on Nashik Misal Queue."
        keywords="check my token, nashik misal queue status, live token status, misal waiting time, digital queue token"
        canonicalUrl="https://nashikmisalqueue.com/check-token"
      />
      <div
        className="min-h-screen w-full bg-[#f8f4ea] bg-top bg-repeat-y font-sans py-6 sm:py-10 px-4 antialiased flex flex-col justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        {/* Wrapper optimized with max-w for mobile and expands nicely on tablets (md) */}
        <div className="w-full max-w-[480px] md:max-w-[560px] mx-auto box-border">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="bg-transparent border-none cursor-pointer text-sm sm:text-base font-semibold text-amber-800 mb-4 flex items-center gap-1.5 hover:underline transition-all"
          >
            ← Browse Shops
          </button>

          {/* Heading & Subtitle */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-900 m-0 mb-2 tracking-tight">
              Check My Token
            </h1>
            <p className="text-xs sm:text-base text-gray-600 leading-relaxed m-0 px-2">
              Track your live queue status using{" "}
              <br className="hidden sm:inline" /> your registered mobile number.
            </p>
          </div>

          {/* Advertisement Carousel */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-sm">
            <AdvertisementCarousel placement="check_token" />
          </div>

          {/* Main Card Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 box-border relative animate-fade-in">
            {/* Mobile Input Field */}
            <div className="mb-5">
              <label className="block mb-2 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                Mobile Number <span className="text-red-600">*</span>
              </label>

              <div className="flex relative items-center shadow-inner rounded-xl overflow-hidden">
                <div className="flex items-center h-12 px-3 sm:px-4 bg-gray-100 text-sm sm:text-base text-gray-700 select-none whitespace-nowrap border-y border-l border-gray-300 rounded-l-xl">
                  🇮🇳 +91 <span className="text-gray-300 ml-1.5">|</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                    setInfoMessage("");
                    setNotFound(false);
                  }}
                  placeholder="Enter 10-digit number"
                  className="flex-1 h-12 px-3.5 bg-white border border-gray-300 text-sm sm:text-base outline-none box-border w-full transition-colors focus:border-orange-500 rounded-r-xl"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleCheck();
                    }
                  }}
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 sm:p-3.5 rounded-xl mb-4 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span> <span>{error}</span>
              </div>
            )}

            {/* Status / Not Found Message Card */}
            {(notFound || infoMessage) && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 sm:p-6 mb-5 text-center shadow-inner">
                <div className="text-4xl sm:text-5xl mb-2.5">😔</div>
                <div className="font-bold text-base sm:text-lg text-amber-900 mb-2">
                  {notFound ? "No Active Token Found" : "Token Status"}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                  {notFound ? (
                    <>
                      Looks like you don't have an active queue today.
                      <br />
                      Browse nearby shops and join instantly.
                    </>
                  ) : (
                    infoMessage
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full h-11 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-bold text-sm cursor-pointer hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                  🍽 Browse Shops
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCheck}
                disabled={!isValidMobile || loading}
                className={`w-full h-12 sm:h-13 bg-orange-500 text-white rounded-xl font-bold text-sm sm:text-base cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 ${!isValidMobile || loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-orange-600 active:scale-[0.98]"
                  }`}
              >
                {loading ? "⏳ Checking Token..." : "CHECK STATUS →"}
              </button>
            </div>

            {/* Privacy Note */}
            <div className="mt-5 sm:mt-6 bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-gray-500 text-[11px] sm:text-xs leading-relaxed text-center">
              🔒 Your phone data is strictly mapped to active counter tokens only.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
