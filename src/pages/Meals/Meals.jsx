import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router";

export default function Meals() {
  const axios = useAxios(); // ✅ FIX
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      const limit = 10;

      const res = await axios.get(
        `/meals?page=${page}&limit=${limit}&sort=${sort}`
      );

      setMeals(res.data.meals || []);
      setTotalPages(res.data.totalPages || 1);
    };

    fetchMeals();
  }, [page, sort, axios]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Meals</h2>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {meals.map((m) => (
          <div key={m._id} className="card p-4 border rounded">
            <img
              src={m.foodImage}
              alt={m.foodName}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-semibold mt-2">{m.foodName}</h3>
            <p>Chef: {m.chefName}</p>
            <p>Price: ${m.price}</p>
            <p>Rating: {m.rating}</p>

            <Link to={`/meals/${m._id}`} className="btn btn-sm mt-2">
              See Details
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="btn"
        >
          Prev
        </button>

        <span className="btn btn-ghost">
          {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
