import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import heroImage from 'public/mockup.png';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="bg-white min-h-screen flex flex-col">
          <div className="relative isolate px-6 pt-6 lg:px-8 flex-1 flex flex-col items-center justify-start">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>

            <div className="flex items-center space-x-4 self-end">
              <Link href="/login" className="text-gray-500 cursor-pointer hover:text-gray-900">
                Connexion
              </Link>
              <Link href="/register" className="cursor-pointer">
                <Button className="cursor-pointer">Commencer</Button>
              </Link>
            </div>
            
            <ScrollAnimation animation="fade-in-up" delay={0.2}>
              <div className="mx-auto max-w-2xl mt-5">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl animate-fade-in-up">
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                      Easy Apply
                    </span>
                    <br />
                    <span className="text-gray-900 text-3xl sm:text-4xl font-medium animate-fade-in-up animation-delay-200">
                      Votre compagnon de recherche d&apos;emploi
                    </span>
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-400">
                   Trouvez, sauvegardez et suivez vos candidatures en un seul endroit. 
                   Plus besoin de perdre du temps à naviguer entre différents sites.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-in-up" delay={0.4}>
              <div className="mt-5 flex items-center justify-center gap-x-6 animate-fade-in-up animation-delay-600">
                <Link href="/register">
                  <Button className='hover:cursor-pointer hover:scale-105 transition-transform duration-200 animate-bounce-subtle'>
                    Commencer
                  </Button>
                </Link>
                
                <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors duration-200 animate-fade-in-up animation-delay-800">
                  En savoir plus <span aria-hidden="true" className="inline-block animate-slide-right">→</span>
                </Link>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="scale-in" delay={0.6}>
              <Image 
                src={heroImage} 
                alt="Image Hero" 
                width={900} 
                height={900} 
                className="animate-fade-in-up animation-delay-1000 hover:scale-105 transition-transform duration-500"
              />
            </ScrollAnimation>
            
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
              <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <ScrollAnimation animation="fade-in-up" threshold={0.2}>
          <div id="features" className="py-24 bg-gray-50 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <ScrollAnimation animation="fade-in-up" delay={0.2}>
                <div className="mx-auto max-w-2xl lg:text-center">
                  <h2 className="text-base font-semibold leading-7 text-indigo-600">Fonctionnalités</h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Simplifiez votre recherche d&apos;emploi
                  </p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Trouvez, sauvegardez et suivez vos candidatures en un seul endroit. 
                    Plus besoin de perdre du temps à naviguer entre différents sites.
                  </p>
                </div>
              </ScrollAnimation>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                  {[
                    {
                      name: 'Recherche multi-sites',
                      description: 'Recherchez des emplois sur plusieurs sites d\'emploi simultanément : HelloWork, Welcome to the Jungle, APEC, Pôle Emploi et bien d\'autres.',
                      icon: (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      )
                    },
                    {
                      name: 'Sauvegarde intelligente',
                      description: 'Sauvegardez les offres qui vous intéressent pour les consulter plus tard. Organisez votre recherche sans perdre de vue les opportunités.',
                      icon: (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                      )
                    },
                    {
                      name: 'Suivi des candidatures',
                      description: 'Marquez les emplois auxquels vous avez postulé et gardez une trace de vos candidatures. Plus jamais de candidature oubliée.',
                      icon: (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    },
                    {
                      name: 'Notes personnalisées',
                      description: 'Ajoutez vos notes personnelles à chaque offre : impressions, questions, points importants. Gardez vos réflexions organisées.',
                      icon: (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      )
                    },
                    {
                      name: 'Filtrage avancé',
                      description: 'Filtrez les résultats par site web, localisation, type de contrat. Trouvez rapidement les offres qui correspondent à vos critères.',
                      icon: (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                        </svg>
                      )
                    },
                    {
                      name: 'Recherche intelligente',
                      description: 'Recherchez dans vos emplois sauvegardés par titre, entreprise ou localisation. La recherche ignore les accents pour plus de flexibilité.',
                      icon: (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                      )
                    },
                  ].map((feature, index) => (
                    <ScrollAnimation 
                      key={feature.name} 
                      animation={index % 2 === 0 ? 'fade-in-left' : 'fade-in-right'} 
                      delay={index * 0.1}
                    >
                      <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 hover:scale-110 transition-transform duration-200">
                            {feature.icon}
                          </div>
                          {feature.name}
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                      </div>
                    </ScrollAnimation>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2023 Easy Apply. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
