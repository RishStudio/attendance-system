"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type React from "react"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Admin", href: "/admin" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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
                Prefect Board
              </motion.span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href} active={pathname === item.href}>
                {item.name}
              </NavLink>
            ))}
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

      {isOpen && (
        <motion.div
          className="sm:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
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
          </div>
        </motion.div>
      )}
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

