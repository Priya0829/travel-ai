import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {

    const [PhotoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.userSelection?.location?.label
        }
        const resp = await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
            setPhotoUrl(PhotoUrl)
        })
    }


    return (
        <Link to={'/view-trip/' + trip?.id}>
            <div className='hover:scale-105 transition-all'>
                <img src={PhotoUrl ? PhotoUrl : "/placeholder.jpg"} className="object-cover rounded-xl h-[220px] w-full object-cover" alt="" />
                <div>
                    <h2 className='font-bold text-lg mt-3'>{trip?.userSelection?.location?.label}</h2>
                    <h2 className='font-medium text-gray-500 text-sm'>{trip?.userSelection?.noOfDays} Days with {trip?.userSelection?.budget} budget for {trip?.userSelection?.traveler} people.</h2>
                </div>
            </div>
        </Link>
    )
}

export default UserTripCardItem
