import React from "react";

interface BadgeProps {
    upperContent: any;
    lowerContent: any;
    color: string;
    children: React.ReactNode;
}

function Badge({upperContent, lowerContent, color, children}: BadgeProps) {
    return (
        <div className={`badge badge-fix d-flex justify-content-around align-items-center p-3 m-3 bg-${color}`}>
            {children}
            <div className="d-flex flex-column justify-content-center align-items-center ms-3">
                <span className="fs-6 mb-2">{upperContent}</span>
                <span>{lowerContent}</span>
            </div>
        </div>
    )
}

export default Badge;