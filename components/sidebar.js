import Link from "next/link";
import React from "react";
import { combineClasses } from "../utils/cssClasses";
import Image from "next/image";
import { getAuth } from "firebase/auth";
import {
  AiOutlineDatabase,
  AiFillContacts,
  AiOutlineUsergroupAdd,
  AiOutlineSketch,
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlineUserAdd,
} from "react-icons/ai";

const Sidebar = () => {
  const styles = {
    wrapper: "p-3 h-full flex flex-col gap-2 justify-between",
    menu: "p3 flex flex-col gap-2",
    menuItem:
      "px-2 py-1 uppercase bg-teal-600 rounded-md cursor-pointer hover:bg-teal-500 text-slate-50 flex gap-2 items-center",
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <a>
              <Image
                className="rounded-full border border-slate-200"
                src="/logos/college-logo.png"
                height={48}
                width={48}
                alt="logo"
              />
            </a>
          </Link>
        </div>
        {[
          ["dashboard", "/dashboard", AiOutlineDashboard],
          ["notices", "/dashboard/notices", AiOutlineDatabase],
          ["banners", "/dashboard/banners", AiFillContacts],
          ["teacher/stuff", "/dashboard/stuff", AiOutlineUsergroupAdd],
          ["gb", "/dashboard/gb", AiOutlineSketch],
          ["me", "/dashboard/me", AiOutlineUserAdd],
        ].map(([menu, href, Icon], index) => (
          <Link href={href} key={index}>
            <a className={styles.menuItem}>
              {Icon && <Icon className="h-8 w-8" />}
              {menu}
            </a>
          </Link>
        ))}
        <button
          className={combineClasses(styles.menuItem, "text-left")}
          onClick={() => getAuth().signOut()}
        >
          <AiOutlineLogout className="h-8 w-8" />
          Signout
        </button>
      </div>

      <div className="text-sm uppercase first-letter:text-red-400">
        &copy; {new Date().getFullYear()} JIBANNAGAR DEGREE COLLEGE. designed by
        ENG MD. RONY AHMMOD.
      </div>
    </div>
  );
};

export default Sidebar;
