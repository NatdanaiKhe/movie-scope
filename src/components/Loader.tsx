import { LoaderCircle } from "lucide-react";

function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoaderCircle className="text-yellow-400 animate-spin" />
    </div>
  );
}

export default Loader