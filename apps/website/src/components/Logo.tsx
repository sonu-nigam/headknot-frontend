export function Logo({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className ?? ''}`}>
            <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
            >
                <rect width="32" height="32" rx="8" fill="#7c3aed" />
                <path
                    d="M11 11 21 11 16 22 11 11Z"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                />
                <circle cx="11" cy="11" r="3" fill="#fff" />
                <circle cx="21" cy="11" r="3" fill="#fff" />
                <circle cx="16" cy="22" r="3" fill="#fff" />
            </svg>
            <span className="text-lg font-semibold tracking-tight text-white">
                Headknot
            </span>
        </div>
    );
}
