import { Header } from "@/components/common/header/Header";
import { AppSidebar } from "@/components/common/sidebar/Sidebar";
import { MobileNavigation } from "@/components/common/mobile-navigation/MobileNavigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function ParentDashboardLayout() {
    return (
        <div className='flex flex-col h-screen'>
            <SidebarProvider>
                <div className='fixed top-0 left-0 right-0 z-50'>
                    <Header />
                </div>

                <div className='flex flex-1 pt-[100px]'>
                    {/* Desktop Sidebar */}
                    <div className='hidden md:block'>
                        <AppSidebar />
                    </div>
                    
                    {/* Mobile Navigation - Always visible at bottom */}
                    <MobileNavigation />
                    
                    <SidebarInset>
                        <main className='flex-1 p-4 overflow-auto pb-4'>
                            <Outlet />
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
