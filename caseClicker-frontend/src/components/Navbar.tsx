import { useEffect, useState, type JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenuFold } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import toast from "react-hot-toast";
import { logoutAction } from "../redux/authService/Action";

interface Role {
    name: string;
}

interface ReqUser {
    firstName: string;
    lastName: string;
    nickName: string;
    roles: Role[];
}

export function Navbar(): JSX.Element {
    const [isPanelVisible, setPanelVisible] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("home");

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((store: RootState) => store.auth);
    const reqUser: ReqUser | undefined = auth.reqUser;

    const togglePanel = () => setPanelVisible(prev => !prev);
    const toggleMenu = () => setMenuOpen(prev => !prev);

    const handleLogout = () => {
        // @ts-ignore
        void dispatch(logoutAction())
            .then(() => {
                navigate("/login");
                toast.success(auth.logoutResponse ?? "Logged out successfully");
            })
            .catch(() => toast.error("Failed to logout. Please try again."));
    };

    const handleTabClick = (tab: { path: string; name: string }) => {
        setActiveTab(tab.path);
        navigate(`/${tab.path}`);
        setPanelVisible(false);
    };

    useEffect(() => {
        const currentPath = location.pathname.replace("/", "") || "home";
        setActiveTab(currentPath);
    }, [location]);

    const tabs = [{ name: "Home", path: "home" }];

    return (
        <header className="bg-[#3E2723] h-24 flex items-center px-8 relative shadow-md shadow-[#00000088]">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-16 h-16 mr-2 rounded-full" />
                <p className="text-white font-bold text-3xl">CaseClicker</p>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden ml-auto z-20">
                <button onClick={togglePanel} className="text-white text-3xl">
                    {isPanelVisible ? <MdCancel /> : <AiOutlineMenuFold />}
                </button>
            </div>

            {/* Navigation panel */}
            <nav
                className={`fixed top-0 right-0 h-full w-3/5 bg-[#3E2723] transform transition-transform duration-500 ease-in-out \
          ${isPanelVisible ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 lg:static lg:flex lg:items-center lg:w-auto ml-auto`}
            >
                <ul className="flex flex-col lg:flex-row gap-4 lg:gap-6 list-none text-center lg:text-left mt-20 lg:mt-0">
                    {tabs.map((tab) => (
                        <li
                            key={tab.path}
                            className={`relative group ${activeTab === tab.path ? "text-amber-300" : "text-white"}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            <Link
                                to={`/${tab.path}`}
                                className="font-bold text-lg transition-colors duration-300 group-hover:text-amber-300"
                            >
                                {tab.name}
                            </Link>
                            <div
                                className={`absolute left-0 bottom-[-5px] h-[3px] rounded transition-all duration-300 bg-amber-300 ${
                                    activeTab === tab.path ? "w-full" : "w-0"
                                } group-hover:w-full`}
                            />
                        </li>
                    ))}
                </ul>

                {/* Mobile user panel */}
                <div className="lg:hidden flex flex-col items-center gap-4 mt-4 absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    {reqUser ? (
                        <>
                            <p className="text-white font-bold text-lg">
                                {reqUser.firstName} {reqUser.lastName}
                            </p>
                            <div className="flex gap-2">
                                {reqUser.roles.map(({ name }, idx) => (
                                    <span key={idx} className="text-xs text-amber-300">{name}</span>
                                ))}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-white font-bold text-lg border border-white px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate("/login")} className="text-white font-bold text-lg">
                            Login
                        </button>
                    )}
                </div>

                {/* Desktop user menu */}
                <div className="hidden lg:flex items-center gap-4 ml-20 relative">
                    {reqUser ? (
                        <>
                            <div className="flex flex-col">
                                <p
                                    className="text-white font-bold text-lg cursor-pointer"
                                    onClick={() => navigate(`/user-profile/${reqUser.nickName}`)}
                                >
                                    {reqUser.firstName} {reqUser.lastName}
                                </p>
                                <div className="flex gap-2">
                                    {reqUser.roles.map(({ name }, idx) => (
                                        <span key={idx} className="text-xs text-amber-300">{name}</span>
                                    ))}
                                </div>
                            </div>
                            <button onClick={toggleMenu} className="text-white text-xl focus:outline-none">
                                <BiDotsVerticalRounded />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-[7vh] right-0 mt-2 bg-[#3E2723] shadow-lg rounded w-40 flex flex-col">
                                    {reqUser.roles.some(role => role.name === "ADMIN") && (
                                        <button
                                            onClick={() => setMenuOpen(false)}
                                            className="w-full text-center px-4 py-2 text-white hover:bg-[#4E3423]"
                                        >
                                            Add Product
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center px-4 py-2 text-white hover:bg-[#4E3423]"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <button onClick={() => navigate("/login")} className="text-white font-bold text-lg">
                            Login
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}