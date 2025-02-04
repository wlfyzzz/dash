"use client"

import { useState, useEffect } from "react"

export function RecentErrors() {
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const fetchErrors = async () => {
      // In a real-world scenario, you'd fetch this from your error logging service
      // For this example, we'll simulate some errors
      const simulatedErrors = [
        'TypeError: Cannot read property "length" of undefined',
        "ReferenceError: someVariable is not defined",
        "SyntaxError: Unexpected token }",
      ]
      setErrors(simulatedErrors)
    }

    fetchErrors()
  }, [])

  return (
    <div>
      {errors.length > 0 ? (
        <ul className="space-y-2">
            
          {errors.map((error, index) => (
                    <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">{error}</h3>  
                      </div>
          ))}
        </ul>
      ) : (
        <p>No recent errors</p>
      )}
    </div>
  )
}

