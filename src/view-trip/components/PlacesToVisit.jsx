import React from 'react'
import PlaceCardItem from './PlaceCardItem';


function PlacesToVisit({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-lg'>Places To Visit</h2>
            <div>

                {trip?.tripData?.itinerary.map((item, index) => (
                    <div>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-800 text-sm md:text-md mt-4 '> Day {item.day}</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
                            {item.plan.map((place, index) => (
                                <div className='my-3'>
                                    <h2 className='font-bold text-sm text-orange-600'>{place.timeToVisit}</h2>
                                    <PlaceCardItem Place={place} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlacesToVisit