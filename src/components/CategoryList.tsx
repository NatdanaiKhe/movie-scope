import { useEffect, useState } from "react";
import { getCategories } from "@/services/movies.service";
import type { CategoryType } from "@/types";
import Loader from "./Loader";
import { Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const results = await getCategories();
        setCategories(results);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (categories.length === 0 && !loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 md:px-10">
      <div className="w-full flex justify-between items-center">
        <span className="text-2xl font-bold text-amber-400">
          <Tag className="inline mr-2 text-2xl font-bold" />
          Browse By Category
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-4">
        {categories.map(category => (
          <div
            key={category.id}
            onClick={()=>{navigate(`/movies?genre=${category.name.toLowerCase()}`)}}
            className="flex justify-center items-center cursor-pointer bg-gray-800 text-white p-4 rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
