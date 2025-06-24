
import React from 'react'

const SmallSpinner = () => {
    return (
        <span className="mr-2 animate-spin">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2"></circle>
                <path d="M12 2a10 10 0 010 20"></path>
            </svg>
        </span>
    )
}

export default SmallSpinner