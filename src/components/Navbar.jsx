"use client";

import { motion } from "motion/react";
import { useAppContext } from "@/app/provider";
import ROUTES from "@/app/routes";
import { DynamicIcon } from "lucide-react/dynamic";
import { SANS } from "@/utils/constants";
import { spaClick } from "@/utils/nav";


const Navbar = () => {
    const {
        isSameRoute,
        setHref,
        setNavbarRouteState,
        navbarRouteState,
        handlePageChange,
        handleToggleTheme
    } = useAppContext();

    const handleClick = (href) => {
        if((!isSameRoute(href) && true) || isSameRoute(href)) {
            setNavbarRouteState(href);
            setHref(href);
            handlePageChange(href);
        }
    }
    return (
        <header className="fixed bottom-0 z-20 flex items-center justify-center w-screen h-16 py-0 border-t border-(--border) bg-(--bg) lg:top-0 lg:border-r lg:border-t-0 lg:w-16 lg:h-full lg:flex-col lg:py-4">
          <nav>
            <ul className="flex items-center justify-center w-full h-full gap-1 lg:gap-2 lg:flex-col ">

              {ROUTES.map((route) => (
                <IconButton
                  isActive={isSameRoute(route.href)}
                  tooltip={route.label}
                  icon={route.icon}
                  handleClick={handleClick}
                  href={route.href}
                  key={route.href}
                >
                  {isSameRoute(route.href, navbarRouteState) && (
                    <motion.div
                      className="absolute top-0 w-full h-full lg:w-px lg:-right-2 opacity-10! lg:opacity-100! right-0 rounded-lg bg-(--nav-active)"
                      layoutId="line"
                    />

                  )}
                </IconButton>
              ))}
            </ul>

          </nav>
          <ul className="fixed z-30 top-[calc(env(safe-area-inset-top)+0.75rem)] right-[calc(env(safe-area-inset-right)+0.75rem)] lg:absolute lg:z-auto lg:top-auto lg:right-auto lg:bottom-4">
              <IconButton tooltip="Toggle theme"
                label="Theme"
                icon="sun-moon"
                iconSize="1.5rem"
                handleClick={handleToggleTheme}
                className="bg-(--bg) border border-(--border) rounded-none lg:bg-transparent lg:border-0 lg:rounded-md"
                />
            </ul>

        </header>
      );
}



const IconButton = ({
    isActive,
    tooltip,
    label,
    handleClick,
    icon: iconNode,
    iconSize = "1.5rem",
    href,
    children,
    className = "",
  }) => {
    const iconColor = isActive ? "var(--active)" : "var(--inactive)";
    const labelColor = isActive ? "var(--active)" : "var(--secondary-text)";
    const inner = (
      <>
        <DynamicIcon name={iconNode} size={iconSize} strokeWidth={1.5} color={iconColor} aria-hidden="true" />
        <span
          className={`${SANS.className} block text-[10px] leading-none mt-1 text-center`}
          style={{ color: labelColor }}
        >
          {label || tooltip}
        </span>
        {children}
      </>
    );

    const sharedProps = {
      className: `relative flex flex-col items-center justify-center cursor-pointer rounded-md px-1.5 py-2 lg:p-2.5 min-w-[48px] min-h-[44px] ${className}`,
      "aria-label": tooltip,
      id: tooltip,
    };

    return (
      <li>
        {href ? (
          <a
            {...sharedProps}
            href={href}
            onClick={(e) => spaClick(e, () => handleClick(href))}
          >
            {inner}
          </a>
        ) : (
          <button {...sharedProps} type="button" onClick={() => handleClick()}>
            {inner}
          </button>
        )}
      </li>
    );
  };


export default Navbar;
