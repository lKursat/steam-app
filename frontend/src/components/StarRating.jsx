import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="d-flex gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => setRating(starValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              size={28}
              color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          </label>
        );
      })}
    </div>
  );
}

export default StarRating;
