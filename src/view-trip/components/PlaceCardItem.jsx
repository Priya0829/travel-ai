import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function PlaceCardItem({ Place }) {

    const [PhotoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        Place && GetPlacePhoto();
    }, [Place])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: Place.placeName
        }

        const resp = await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
            // console.log(PhotoUrl)
            setPhotoUrl(PhotoUrl)
        })
    }
    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + Place?.placeName} target='_blank'>
            <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer hover:shadow-lg'>
                <img className="h-[130px] w-[130px] rounded-xl object-cover" src={PhotoUrl ? PhotoUrl : '/placeholder.jpg'} alt="" />
                <div>
                    <h2 className='font-bold text-lg'>{Place.placeName}</h2>
                    <p className='text-sm text-gray-600'>{Place.placeDetails}</p>
                    <h2 className=' text-sm text-gray-500'>⭐ {Place?.rating} Stars</h2>
                    <h2 className=' text-sm'>💰 {Place?.ticketPricing}</h2>
                </div>
            </div>
        </Link>
    )
}

export default PlaceCardItem
