'use client';

import { UserIcon } from "lucide-react"
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setView } from '@/lib/redux/features/dashboardSlice';
import Image from "next/image";
import { useRouter } from "next/navigation";

function Header() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentView = useSelector((state: RootState) => state.dashboard.currentView);

  return (
    <div className="w-full max-h-[57px] bg-lightBg">
      <div className="flex justify-between px-3 h-auto border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-primary font-medium text-2xl py-3">Easy Apply</span>
  
          {/* navigation links */}
          <div className="flex h-full items-center gap-4">
            <div className="relative h-full group flex justify-center">
              <button 
                onClick={() => {
                  dispatch(setView('find'));
                  router.push('/dashboard')
                }}
                className={`text-sm hover:cursor-pointer relative group ${currentView === 'find' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Rechercher un emploi
              </button>
              <div className={`absolute bottom-0 left-0 w-full h-[4px] bg-primary transform origin-left transition-all duration-300 ease-out ${currentView === 'find' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
            </div>
            <div className="relative h-full group flex justify-center">
              <button 
                onClick={() => {
                  dispatch(setView('saved'));
                  router.push('/dashboard')
                }}
                className={`text-sm hover:cursor-pointer relative group ${currentView === 'saved' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Sauvegardés / Postulés
              </button>
              <div className={`absolute bottom-0 left-0 w-full h-[4px] bg-primary transform origin-left transition-all duration-300 ease-out ${currentView === 'saved' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
            </div>
          </div>
        </div>

        {/* user icon */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/dashboard/settings')}
            className="flex hover:opacity-80 transition-opacity cursor-pointer"
          >
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-2">
                <div className="inline text-sm text-gray-800">
                  {session.user.name || session.user.email}
                </div>
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Avatar utilisateur"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-600" />
                )}
              </div>
            ) : (
              <UserIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header

