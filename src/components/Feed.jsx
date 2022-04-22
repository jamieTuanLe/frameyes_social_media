import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client.js'
import { feedQuery, searchQuery } from '../utils/data.js'
import MasonryLayout from './MasonryLayout.jsx'
import Spinner from './Spinner.jsx'

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    if (categoryId) {
      const query = searchQuery(categoryId)

      client.fetch(query)
        .then((data) => {
          setLoading(false)
          setPins(data)
        })
    } else {
      client.fetch(feedQuery)
        .then((data) => {
          setLoading(false)
          setPins(data)
        })
    }

  }, [categoryId])

  if (loading) return (<Spinner message="We are adding new ideas to your feed!" />)

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed