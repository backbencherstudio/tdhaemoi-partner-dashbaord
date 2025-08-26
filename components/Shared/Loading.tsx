import React from 'react'

interface LoadingProps {
    isFullPage?: boolean
    message?: string
}

export default function Loading({ isFullPage = false, message = "Loading..." }: LoadingProps) {
    if (isFullPage) {
        return (
            <div className="fixed inset-0 bg-black/50  backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
                <div className="text-center">
                    {/* Enhanced Spring Loading Animation */}
                    <div className="flex justify-center items-center space-x-3 mb-6">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms', animationDuration: '1.2s' }}></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '400ms', animationDuration: '1.2s' }}></div>
                    </div>

                    {/* Loading Text with Typing Effect */}
                    <div className="text-xl font-semibold text-gray-800 mb-4">{message}</div>

                    {/* Enhanced Progress Bar */}
                    <div className="w-56 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-sm"></div>
                    </div>
                </div>
            </div>
        )
    }

    // Inline loading spinner
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms', animationDuration: '1s' }}></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms', animationDuration: '1s' }}></div>
        </div>
    )
}
