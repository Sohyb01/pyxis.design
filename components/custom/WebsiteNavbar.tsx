import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { LogoMark } from "./LogoSVGs";

export default function WebsiteNavbar() {
  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-between items-center px-4 container">
      <Link
        href="/#"
        className={`${buttonVariants({ variant: "outline", size: "icon" })} `}
      >
        <LogoMark width={14} className="scale-130" />
      </Link>
      <Link
        href="/work"
        className={`${buttonVariants({ variant: "outline" })}`}
      >
        Recent work
        <ArrowUpRight className="size-4" />
      </Link>
      {/* <Button variant={"ghost"} disabled>
        Resources (coming soon)
      </Button> */}
    </nav>
  );
}
