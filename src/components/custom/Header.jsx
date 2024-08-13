import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { PanelTopDashed } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { Link } from 'react-router-dom';




function Header() {

    const user = JSON.parse(localStorage.getItem('user'));
    const [openDialogue, setOpenDialogue] = useState(false);

    useEffect(() => {
        console.log(user)
    }, [])

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    })

    const GetUserProfile = async (tokenInfo) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
                headers: {
                    Authorization: `Bearer ${tokenInfo?.access_token}`,
                    Accept: 'application/json'
                }
            });
            console.log(response);
            localStorage.setItem('user', JSON.stringify(response.data));
            setOpenDialogue(false);
            window.location.reload();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };


    return (
        <div className='p-2 shadow-sm flex justify-between items-center px-5 '>
            <div className='flex justify-between items-center gap-2'>
                <a href="/">
                    <img src="/logo.svg" alt="" /></a>
                <h2 className='hidden md:block'>TRAVEL AI</h2>
            </div>
            <div>
                {user ?
                    <div className='flex items-center gap-3'>
                        <a href="/create-trip"><Button variant="outline" className="rounded-full">Create Trip</Button></a>
                        <a href="/my-trips"><Button variant="outline" className="rounded-full">My Trips</Button></a>
                        <Popover>
                            <PopoverTrigger>
                                <img src={user?.picture} alt="" className='h-[35px] w-[35px] rounded-full' />
                            </PopoverTrigger>
                            <PopoverContent>
                                <h2 onClick={() => {
                                    googleLogout();
                                    localStorage.clear();
                                    window.location.reload();
                                }} className='text-lg font-medium cursor-pointer'>Logout</h2>
                            </PopoverContent>
                        </Popover>


                    </div>
                    : <Button onClick={() => setOpenDialogue(true)}>Sign In</Button>
                }
            </div>
            <Dialog open={openDialogue}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <div className='flex items-center'>
                                <img src="/logo.svg" alt="" />
                                <h2 className='font-bold text-lg px-3'>TRAVEL AI</h2>
                            </div>
                            <h2 className='text-lg text-gray-600 mt-3 px-1'>Sign into the app securely with Google</h2>
                            <h2 className='text-sm text-gray-400 px-1'>Sign into the app securely with Google</h2>
                            <Button
                                onClick={login}
                                className="w-full mt-2 flex gap-4 items-center"><FcGoogle className='h-5 w-5' /> Sign in With Google</Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default Header
