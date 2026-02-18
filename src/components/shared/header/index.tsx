import Link from "next/link"
import Image from "next/image"
import ThemeToggle from "./theme-toggle"
import { APP_NAME } from "../../../../lib/constants"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME}`}
              height={48}
              width={48}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
