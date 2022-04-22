import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout.jsx'
import { client } from '../client.js'

import { feedQuery, searchQuery } from '../utils/data.js'
import Spinner from './Spinner.jsx'

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(searchTerm) {
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })

    }else {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }

  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      <MasonryLayout pins={pins} />
    </div>
  )
}

export default Search