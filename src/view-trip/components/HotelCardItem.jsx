import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({ hotel }) {
    const [PhotoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        hotel && GetPlacePhoto();
    }, [hotel])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: hotel?.hotelName
        }

        const resp = await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
            // console.log(PhotoUrl)
            setPhotoUrl(PhotoUrl)
        })
    }
    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + ',' + hotel?.hotelAddress} target='_blank'>
            <div className='hover:scale-105 transition-all cursor-pointer'>
                <img className="rounded-xl h-[200px] w-full object-cover" src={PhotoUrl ? PhotoUrl : '/placeholder.jpg'} alt="" />
                <div className='my-2'>
                    <h2 className='font-bold text-sm'>{hotel?.hotelName}</h2>
                    <h2 className=' text-xs text-gray-500'>📍{hotel?.hotelAddress}</h2>
                    <h2 className=' text-sm'>💰 {hotel?.price}</h2>
                    <h2 className=' text-sm text-gray-500'>⭐ {hotel?.rating} Stars</h2>
                </div>
            </div>
        </Link>
    )
}

export default HotelCardItem
