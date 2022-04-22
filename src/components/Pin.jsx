import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import { client, urlFor } from '../client.js'
import { fetchUser } from '../utils/fetchUser.js'

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false)
    const navigate = useNavigate()
    const user = fetchUser()

    const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === user?.googleId))?.length

    const savePin = (id) => {
        if (!alreadySaved) {
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.googleId,
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload()
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <img className="rounded-lg w-full" alt="user-post" src={urlFor(image).width(250).url()} />
                {postHovered && (
                    <div
                        className="absolute top-0 left-0 w-full flex flex-col justify-between items-center p-2 pl-1 z-50"
                        style={{ height: '100%' }}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2">
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button
                                    type="button"
                                    className="bg-red-500 opacity-70 hover:opacity-100 text-white text-bold text-base px-5 py-1 rounded-3xl hover:shadow-md outline-none"
                                >
                                    {`${save?.length}`} Saved
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="bg-red-500 opacity-70 hover:opacity-100 text-white text-bold text-base px-5 py-1 rounded-3xl hover:shadow-md outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        savePin(_id)
                                    }}
                                >
                                    {`${save?.length ? save.length : ''}`} Save
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-center gap-2 w-full ">
                            {destination && (
                                <a
                                    href={destination}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white flex items-center gap-2 text-black text-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 30 ? `${destination.slice(8, 20)}...` : destination.slice(8)}
                                </a>
                            )}
                            {postedBy?._id === user?.googleId && (
                                <button
                                    type="button"
                                    className="bg-white opacity-70 hover:opacity-100 text-dark p-2 rounded-full outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deletePin(_id)
                                    }}
                                >
                                    <MdDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
                <img 
                    className="w-8 h-8 rounded-full object-cover"
                    src={postedBy?.image}
                    alt="user-profile"
                />
                <p className="font-semibold capitalize">{postedBy?.userName}</p>
            </Link>

        </div>
    )
}

export default Pin