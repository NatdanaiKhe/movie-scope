import type { CastType,CrewType } from "@/types"
import { getCastProfileUrl } from "@/services/movies.service"

function CastCard({cast}: { cast: CastType | CrewType}) {

  const isCast = (cast: CastType | CrewType): cast is CastType => {
    return "character" in cast;
  };

  return (
    <div className="flex md:w-[300px] flex-col items-center p-4 rounded-lg transition-transform hover:scale-105">
      <div className="w-full h-auto bg-gray-800">
        <img
          src={getCastProfileUrl(cast.profile_path ?? "")}
          alt={cast.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="w-full min-h-26 flex flex-col flex-auto p-4 bg-gray-800">
        <h3 className="font-bold text-xl text-white">{cast.name}</h3>
        <p className="text-md text-gray-400">{isCast(cast) ? cast.character : cast.job}</p>
      </div>
    </div>
  );
}

export default CastCard