import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AimSection } from '../components/sections/AimSection';
import { ApparatusSection } from '../components/sections/ApparatusSection';
import { SetupSection } from '../components/sections/SetupSection';
import { TheorySection } from '../components/sections/TheorySection';
import { ProcedureSection } from '../components/sections/ProcedureSection';
import { ObservationSection } from '../components/sections/ObservationSection';
import { ResultSection } from '../components/sections/ResultSection';
import { PrecautionsSection } from '../components/sections/PrecautionsSection';
import { ApplicationsSection } from '../components/sections/ApplicationsSection';
import { QuizSection } from '../components/sections/QuizSection';

export function Home() {
  const [experimentData, setExperimentData] = useState(null);

  const handleStatsCalculated = (data) => {
    setExperimentData(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <AimSection />
        <ApparatusSection />
        <SetupSection />
        <TheorySection />
        <ProcedureSection />
        <ObservationSection onStatsCalculated={handleStatsCalculated} />
        <ResultSection experimentData={experimentData} />
        <PrecautionsSection />
        <ApplicationsSection />
        <QuizSection />
      </main>

      <Footer />
    </div>
  );
}
