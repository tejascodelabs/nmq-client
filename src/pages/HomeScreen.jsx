import React, { useState, useMemo } from 'react'
import {
    QrCode,
    Search,
    X,
    MapPin,
    Star,
    Ticket,
    ChevronRight,
    Clock,
    UtensilsCrossed,
    Sparkles,
    Flame
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SHOPS_DATA = [
    {
        id: 6,
        shopName: "Grape Embassy",
        address: "Near Suyojit Bridge, Road, Makhmalabad, Gangapur, Nashik, Maharashtra 422003",
        openingTime: "08:30:00",
        closingTime: "16:00:00",
        initialRating: "4.4",
        totalReviews: 14987,
        profileImage: "https://ik.imagekit.io/nashikmisalqueue/shops/1793432504843-4bca4e16-7636-4ebc-9fa9-ba8bdfaf57f9.png",
        status: "active"
    },
    {
        id: 7,
        shopName: "Sadhana Chulivarchi Misal",
        address: "Hardev Bagh, Near Bardan Phata, Gangapur Road, Nashik, Maharashtra 422013",
        openingTime: "08:00:00",
        closingTime: "15:30:00",
        initialRating: "4.7",
        totalReviews: 21450,
        profileImage: "https://ik.imagekit.io/nashikmisalqueue/shops/1793432504843-4bca4e16-7636-4ebc-9fa9-ba8bdfaf57f9.png",
        status: "active"
    }
]

// Helper: Check if shop is currently open based on HH:mm:ss strings
function checkIsOpen(openingTime, closingTime) {
    if (!openingTime || !closingTime) return true
    const now = new Date()
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

    const [openH, openM, openS] = openingTime.split(':').map(Number)
    const [closeH, closeM, closeS] = closingTime.split(':').map(Number)

    const openSeconds = openH * 3600 + openM * 60 + (openS || 0)
    const closeSeconds = closeH * 3600 + closeM * 60 + (closeS || 0)

    return currentSeconds >= openSeconds && currentSeconds <= closeSeconds
}

// Helper: Format "08:30:00" -> "8:30 AM"
function formatTime12Hr(timeStr) {
    if (!timeStr) return ''
    const [hourStr, minuteStr] = timeStr.split(':')
    let hour = parseInt(hourStr, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12 || 12
    return `${hour}:${minuteStr} ${ampm}`
}

// Helper: Format 14987 -> "15.0k"
function formatReviews(count) {
    if (!count) return '0'
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count
}

function ShopCard({ shop, onSelect }) {
    const [imgError, setImgError] = useState(false)
    const isOpen = checkIsOpen(shop.openingTime, shop.closingTime)
    const rating = parseFloat(shop.initialRating || 0).toFixed(1)

    return (
        <div
            onClick={() => onSelect(shop.id)}
            className="group bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
        >
            {/* Card Image Header */}
            <div className="relative h-44 sm:h-48 w-full bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 overflow-hidden">
                {shop.profileImage && !imgError ? (
                    <img
                        src={shop.profileImage}
                        alt={shop.shopName}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-orange-400">
                        <UtensilsCrossed className="w-12 h-12 mb-1 opacity-75" />
                        <span className="text-xs font-semibold tracking-wide uppercase text-orange-600/70">
                            Nashik Misal
                        </span>
                    </div>
                )}

                {/* Top Gradient Overlay for Badge Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top Left: Open / Closed Pill */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                            isOpen
                                ? 'bg-emerald-500/95 text-white'
                                : 'bg-gray-900/85 text-gray-200'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                isOpen ? 'bg-white animate-pulse' : 'bg-red-400'
                            }`}
                        />
                        {isOpen ? 'OPEN NOW' : 'CLOSED'}
                    </span>
                </div>

                {/* Top Right: Rating Pill */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-extrabold text-gray-900">{rating}</span>
                    <span className="text-[11px] font-medium text-gray-500">
                        ({formatReviews(shop.totalReviews)})
                    </span>
                </div>

                {/* Bottom Overlay: Timing */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-medium bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-[#fc8019]" />
                        <span>
                            {formatTime12Hr(shop.openingTime)} – {formatTime12Hr(shop.closingTime)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#fc8019] transition-colors line-clamp-1">
                            {shop.shopName}
                        </h3>
                    </div>

                    <div className="flex items-start gap-1.5 mt-1.5 text-gray-500">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm leading-snug line-clamp-2">
                            {shop.address}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function HomeScreen() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')

    const quickFilters = [
        { id: 'all', label: 'All Shops', icon: UtensilsCrossed },
        { id: 'open', label: 'Open Now', icon: Sparkles },
        { id: 'top', label: 'Top Rated (4.5+)', icon: Star }
    ]

    // Filter shops dynamically
    const filteredShops = useMemo(() => {
        return SHOPS_DATA.filter((shop) => {
            if (shop.status !== 'active') return false

            const matchesSearch =
                shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shop.address.toLowerCase().includes(searchTerm.toLowerCase())

            if (!matchesSearch) return false

            if (activeFilter === 'open') {
                return checkIsOpen(shop.openingTime, shop.closingTime)
            }
            if (activeFilter === 'top') {
                return parseFloat(shop.initialRating) >= 4.5
            }
            return true
        })
    }, [searchTerm, activeFilter])

    return (
        <div className="min-h-screen bg-gray-50/60 pb-28">
            <div className="max-w-5xl mx-auto px-4 pt-5 sm:pt-8">
                {/* Header with Scanner */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-500">
                            👋 Welcome
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Nashik's Misal Hub
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                            Explore top-rated misal shops, compare queues and join instantly.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/scan-qr')}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#fc8019] bg-white text-[#fc8019] flex items-center justify-center shrink-0 shadow-sm hover:bg-orange-50 active:scale-95 transition"
                        aria-label="Scan QR Code"
                    >
                        <QrCode className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                </div>

                {/* Search Input Area */}
                <div className="mb-3">
                    <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-xs focus-within:border-[#fc8019] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3.5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search shops or locations..."
                            className="w-full pl-11 pr-10 py-3 bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 outline-none"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 mb-4">
                    {quickFilters.map((filter) => {
                        const isSelected = activeFilter === filter.id
                        const IconComponent = filter.icon
                        return (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                                    isSelected
                                        ? 'bg-[#fc8019] text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                {filter.label}
                            </button>
                        )
                    })}
                </div>

                {/* Promo / Ad Banner */}
              
                {/* Section Title */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                        Popular Misal Spots
                    </h2>
                    <span className="text-xs font-semibold text-gray-500">
                        {filteredShops.length} {filteredShops.length === 1 ? 'shop' : 'shops'}
                    </span>
                </div>

                {/* Restaurant Cards Grid */}
                {filteredShops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filteredShops.map((shop) => (
                            <ShopCard
                                key={shop.id}
                                shop={shop}
                                onSelect={(id) => navigate(`/details/${id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                        <UtensilsCrossed className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-base font-bold text-gray-800">No shops found</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Try clearing your search or switching to "All Shops".
                        </p>
                        {(searchTerm || activeFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setActiveFilter('all')
                                }}
                                className="mt-4 px-4 py-2 bg-orange-50 text-[#fc8019] font-bold text-xs rounded-xl hover:bg-orange-100 transition"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Fixed Bottom Check My Token Button */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:p-4 shadow-lg">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={() => navigate('/check-token')}
                        className="w-full h-12 bg-[#fc8019] hover:bg-orange-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 transition-all"
                    >
                        <Ticket className="w-5 h-5" />
                        Check My Token Status
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen