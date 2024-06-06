'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from 'next-auth'
import { Button } from "./ui/button";

function Navbar() {
    const {data: session} = useSession();
    const user: User = session?.user as User;
  return (
    <nav className=" w-full relative bg-black text-white border-b-2 py-4 z-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            <a href="/" className="text-3xl font-extrabold">Ask-it</a>
            {session ? (
                <><span>Welcome, {user.username || user.email}</span>
                <Button onClick={() => signOut()} className="bg-black border border-neutral-300 hover:bg-neutral-950">Logout</Button></>
            ) : (<Link href={'/sign-in'}><Button className="bg-black border border-neutral-300 hover:bg-neutral-950">Login</Button></Link>) }
        </div>
    </nav>
  )
}

export default Navbar
