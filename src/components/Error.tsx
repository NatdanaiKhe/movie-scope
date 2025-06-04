import { Tv } from 'lucide-react';
import NavBar from './NavBar';

function Error() {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      <NavBar/>
      <div className='w-full h-full flex flex-col flex-auto items-center justify-center text-center'>
        <Tv className="text-yellow-400" size={64} />
        <h1 className="text-4xl font-bold text-yellow-400 mt-4">Oops!</h1>
        <p className="text-lg text-gray-300 mt-2">
          Something went wrong. Please try again later.
        </p>
      </div>
    </div>
  );
}

export default Error