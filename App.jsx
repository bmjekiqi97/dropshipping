import React from 'react'
import products from './data/products'

export default function App() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dropshipping Store</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-2xl shadow p-4 flex flex-col">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
            <p className="text-gray-600 mb-2">${product.price}</p>
            <button className="mt-auto bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}
