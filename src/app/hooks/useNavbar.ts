import {useState} from "react"

export function useNavbar() {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTourOpen, setSidebarTourOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);
    const toggleTourDropdown = () =>
        setSidebarTourOpen((prev) => !prev);
    const toggleOpen = () => setOpen((prev) => !prev);

    return {
        open,
        sidebarOpen,
        sidebarTourOpen,
        toggleSidebar,
        toggleTourDropdown,
        toggleOpen,
        closeSidebar,
    };
}