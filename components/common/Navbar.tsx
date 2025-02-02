"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Admin", href: "/admin" },
  { name: "About", href: "/about" },
]

const dropdownItems = [
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.span
                className="text-2xl font-bold text-primary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                BOP Attendance System
              </motion.span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href} active={pathname === item.href}>
                {item.name}
              </NavLink>
            ))}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                More
                <ChevronDown className="ml-1 h-5 w-5" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  >
                    {dropdownItems.map((item) => (
                      <DropdownLink key={item.name} href={item.href} onClick={() => setIsDropdownOpen(false)}>
                        {item.name}
                      </DropdownLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.name}
                  href={item.href}
                  active={pathname === item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </MobileNavLink>
              ))}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  More
                  <ChevronDown className="ml-1 h-5 w-5" />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="pl-3 pr-4 py-2 space-y-1"
                    >
                      {dropdownItems.map((item) => (
                        <MobileNavLink
                          key={item.name}
                          href={item.href}
                          active={pathname === item.href}
                          onClick={() => {
                            setIsOpen(false)
                            setIsDropdownOpen(false)
                          }}
                        >
                          {item.name}
                        </MobileNavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link href={href} passHref>
      <motion.span
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          active
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        }`}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        {children}
      </motion.span>
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  active,
  onClick,
}: { href: string; children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <Link href={href} passHref>
      <motion.span
        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
          active
            ? "bg-primary/10 border-primary text-primary"
            : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
        }`}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  )
}

function DropdownLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} passHref>
      <motion.span
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  )
}