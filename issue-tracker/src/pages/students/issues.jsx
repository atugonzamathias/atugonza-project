import React from "react";
import { useState, useEffect } from 'react'
import Wrapper from '../../components/wrapper'
import Card from '../../components/Cards'
import api from '../../API'
import { useAuth } from '../../context/AuthContext'

const Issues = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchIssueStats = async () => {
      try {
        const response = await api.get('/issues/metrics/')
        setStats({
          total: response.data.total,
          pending: response.data.pending,
          resolved: response.data.resolved
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch issue statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchIssueStats()
  }, [user]) // Add user to dependency array

  if (loading) return <Wrapper>Loading...</Wrapper>
  if (error) return <Wrapper>{error}</Wrapper>

  return (
    <Wrapper>
      <div className='mt-4 mb-4 flex flex-col gap-2 md:flex-row md:justify-between'>
        <Cards
          title="Total Issues"
          number={stats.total}
        />
        <Cards
          title="Pending Issues"
          number={stats.pending}
        />
        <Cards
          title="Resolved Issues"
          number={stats.resolved}
        />
      </div>
    </Wrapper>
  )
}

export default Issues
