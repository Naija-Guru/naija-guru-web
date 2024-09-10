'use client';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Demo() {
  const [errors, setErrors] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Spell checker demo</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div
            className="w-full h-[calc(100vh-200px)] p-4 bg-white overflow-auto text-xl"
            contentEditable
          >
            Sure! Here’s a three-paragraph sentence in Pidgin English: Make I
            tell you, life na journey wey no get one road. Sometimes, you go
            waka for smooth road, everything go dey jolly, but other times, e
            fit be say na wahala full the road. Na why dem talk say, no matter
            how e be, you gatz hold strong, no give up. As you dey hustle, you
            go see say no be every day go soft, but na the ginger wey you carry
            for mind go make the wahala no too heavy. Even if rain fall or sun
            shine, you gatz waka your waka because na persistence dey bring beta
            result. Last last, e no matter how slow or fast you dey go, as long
            as you no sidon dey look, you go reach where you wan reach.
          </div>
          <div className="lg:w-1/3 lg:static fixed bottom-0 left-0 right-0 bg-white">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Errors</h2>
              {errors.length === 0 ? (
                <p className="text-green-600">No errors found.</p>
              ) : (
                <ul className="space-y-2">
                  {errors.map((error) => (
                    <li
                      key={error.id}
                      className="flex items-start gap-2 text-red-600"
                    >
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>{error.word}</strong>: {error.message}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
