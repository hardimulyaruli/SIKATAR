import React, { useState, useEffect } from 'react';
import Sidebar from '@/Components/UI/Sidebar';
import Navbar from '@/Components/UI/Navbar';

export default function OperatorLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Auto-close sidebar on small screens initially
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-background text-on-background font-sans-inter antialiased flex flex-col md:flex-row overflow-x-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto">
                    {children}
                </main>
            </div>
            
            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-on-surface/20 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
