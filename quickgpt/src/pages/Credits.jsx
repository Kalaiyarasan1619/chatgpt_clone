import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    // future la API call replace pannalam
    setPlans(dummyPlans)
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="w-full min-h-screen bg-[#0B0F19] px-6 md:px-12 lg:px-16 py-16">

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
        🚀 Choose Your Plan
      </h2>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`relative rounded-2xl p-6 flex flex-col justify-between 
            border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
            ${plan._id === "pro"
                ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white border-none scale-105"
                : "bg-[#111827] text-gray-300 border-gray-700"
              }`}
          >

            {/* Most Popular Badge */}
            {plan._id === "pro" && (
              <span className="absolute top-4 right-4 bg-white text-purple-600 text-xs px-3 py-1 rounded-full font-semibold shadow">
                🔥 Most Popular
              </span>
            )}

            {/* Plan Name */}
            <h3 className="text-2xl font-semibold mb-4 text-center">
              {plan.name}
            </h3>

            {/* Price */}
            <p className="text-center text-4xl font-bold mb-6">
              ${plan.price}
              <span className="text-sm font-normal opacity-80">
                {" "} / {plan.credits} credits
              </span>
            </p>

            {/* Features */}
            <ul className="space-y-3 text-sm mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-400">✔</span> {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-200
              ${plan._id === "pro"
                ? "bg-white text-purple-600 hover:bg-gray-200"
                : "bg-purple-600 text-white hover:bg-purple-700"
              }`}>
              Buy Now 🚀
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Credits