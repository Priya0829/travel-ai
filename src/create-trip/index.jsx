import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModel';
import React, { useState, useEffect } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';


function CreateTrip() {

    const [place, setPlace] = useState();

    const [formData, setFormData] = useState([]);

    const [openDialogue, setOpenDialogue] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        console.log(formData);
    }, [formData])

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    })


    const OnGenerateTrip = async () => {

        const user = localStorage.getItem('user');

        if (!user) {
            setOpenDialogue(true);
            return;
        }
        if (formData?.noOfDays > 11) {
            toast("Maximum 10 days!");
            return;
        }
        if (!formData?.location || !formData?.budget || !formData?.noOfDays || !formData?.traveler) {
            toast("Please fill every Field.");
            return;
        }

        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.label)
            .replace('{noOfDays}', formData?.noOfDays)
            .replace('{traveler}', formData?.traveler)
            .replace('{budget}', formData?.budget)
            .replace('{noOfDays}', formData?.noOfDays)

        console.log(FINAL_PROMPT)

        const result = await chatSession.sendMessage(FINAL_PROMPT);

        setLoading(false);
        console.log(result?.response?.text());
        SaveAITrip(result?.response?.text());
    }

    // "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"

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
            OnGenerateTrip();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const SaveAITrip = async (TripData) => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docID = Date.now().toString()
        await setDoc(doc(db, "AITrip", docID), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docID
        });
        setLoading(false);
        navigate('/view-trip/' + docID);
    }

    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-80 px-5 mt-20'>
            <h2 className='font-bold text-4xl'>Personalize Your Adventure ✈️</h2>
            <p className='mt-3 text-gray-500 text-xl'>From your dream destinations to specific interests, your input will help us create a perfect itinerary tailored to your unique tastes and needs.</p>

            <div className='mt-20 flex flex-col gap-10'>
                <div>
                    <h2 className='text-xl font-bold my-3 font-bold'>What is destination of choice?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); handleInputChange('location', v) }
                        }}
                    />
                </div>
                <div>
                    <h2 className='text-xl font-bold my-3'>How many days are you planning this trip for? <span className='text-gray-400 text-sm'>(Maximum 10 days)</span></h2>
                    <Input placeholder={"Ex. 3"} type="number"
                        onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                    />
                </div>

                <div>
                    <h2 className='text-xl font-bold my-3'>What is your Budget?</h2>
                    <div className='grid md:grid-cols-3 gap-5 mt-5 '>
                        {SelectBudgetOptions.map((item, index) => (
                            <div key={index}
                                onClick={() => handleInputChange('budget', item.title)}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                                ${formData?.budget == item.title && 'shadow-lg border-black'}`}>
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className='text-xl font-bold my-3'>Who do you plan to travel with on your next adventure?</h2>
                    <div className='grid md:grid-cols-3 gap-5 mt-5 '>
                        {SelectTravelesList.map((item, index) => (
                            <div key={index}
                                onClick={() => handleInputChange('traveler', item.people)}
                                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg 
                                ${formData?.traveler == item.people && 'shadow-lg border-black'}`}>
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                                <h2 className='text-sm text-gray-400'>{item.people}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='my-10 flex justify-center'>
                <Button
                    disabled={loading}
                    onClick={OnGenerateTrip} className="px-20">
                    {loading ?
                        <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'
                    }
                </Button>
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

export default CreateTrip