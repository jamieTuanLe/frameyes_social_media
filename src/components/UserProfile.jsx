
import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'

import { userQuery, userCreatedPinsQuery, userSavedPinsQuery } from '../utils/data.js'
import { client } from '../client.js'
import MasonryLayout from './MasonryLayout.jsx'
import Spinner from './Spinner.jsx'

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'
const activeBtnStyle = 'bg-red-500 mx-2 text-white font-bold p-2 rounded-full w-20 outline-none'
const notActiveBtnStyle = 'bg-primary mx-2 text-dark font-bold p-2 rounded-full w-20 outline-none'

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const { userId } = useParams()

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })


  }, [userId])

  useEffect(() => {
    if (text === 'Created') {
      const created = userCreatedPinsQuery(userId)

      client.fetch(created)
        .then((data) => {
          setPins(data)
        })
    } else {
      const saved = userSavedPinsQuery(userId)

      client.fetch(saved)
        .then((data) => {
          setPins(data)
        })
    }

  }, [text, userId])

  if (!user) return <Spinner message="Loading profile..." />

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="relative pb-2 h-full items-center justify-center ">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="background-user"
              className="w-full shadow-lg object-cover"
              style={{ height: '300px' }}
            />
            <img
              src={user?.image}
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              alt="user-profile"
            />
            <h1 className="font-bold text-3xl text-center mt-3">{user?.userName}</h1>
            <div className="absolute top-0 right-0 z-1 p-2">
              {userId === user?._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_AUTH_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle}`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle}`}
            >
              Saved
            </button>
          </div>
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile