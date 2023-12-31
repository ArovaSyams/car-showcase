"use client"

import { Hero, CustomFilter, SearchBar, CarCard, ShowMore } from '@/components'
import { fuels, yearsOfProduction } from '@/constants';
import { fetchCars } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // search state
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  // filter state
  const [year, setYear] = useState(2022);
  const [fuel, setFuel] = useState("");

  // pagination
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const results = await fetchCars({
        manufacturer: manufacturer || '',
        year: year || 2022,
        fuel: fuel || '',
        limit: limit || 10,
        model: model || '',
      });
      
      setAllCars(results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    getCars();
  }, [manufacturer, model, year, fuel, limit])
  


  return (
    <main className="overflow-hidden">
      <Hero/>

      <div id="discover" className="mt-12 padding-x padding-y max-width">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the car you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar 
            setManufacturer={setManufacturer}
            setModel={setModel}
          />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel}/>
            <CustomFilter title="year" options={yearsOfProduction} setFilter={setYear}/>
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car}/>
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image 
                  src="/steering-wheel.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="animate-spin object-contain"
                />
              </div>
            )}

            <ShowMore 
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            {loading ? (
              <div className="mt-16 w-full flex-center">
                <Image 
                  src="/steering-wheel.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="animate-spin object-contain"
                />
              </div>
            ) : (
              <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
