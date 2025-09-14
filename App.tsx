import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { GoogleGenAI, Type } from "@google/genai";
import { GapminderData } from './types';
import CountrySelector from './components/CountrySelector';
import PopulationChart from './components/PopulationChart';

const DATA_URL = 'https://raw.githubusercontent.com/plotly/datasets/master/gapminder_unfiltered.csv';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [data, setData] = useState<GapminderData[]>([]);
  const [originalData, setOriginalData] = useState<GapminderData[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('Canada');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [predicting, setPredicting] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();
      Papa.parse<GapminderData>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            setError('Error parsing CSV data.');
            console.error('CSV Parsing Errors:', results.errors);
            setLoading(false);
            return;
          }
          const validData = results.data.filter(row => row.country && row.year && row.pop);
          setData(validData);
          setOriginalData(validData);
          const uniqueCountries = [...new Set(validData.map((item: GapminderData) => item.country))].sort();
          setCountries(uniqueCountries);
          setLoading(false);
        },
        error: (err) => {
           setError('Failed to parse CSV file.');
           console.error(err);
           setLoading(false);
        }
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(`Failed to fetch data: ${message}`);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handlePredictionToggle = useCallback(async (checked: boolean) => {
    setShowPrediction(checked);
    if (!checked) {
      setData(originalData); // Revert to original data
      return;
    }

    setPredicting(true);
    setError(null);

    const countryData = originalData.filter(d => d.country === selectedCountry);
    if (countryData.length === 0) {
      setError("No data available for this country to make a prediction.");
      setPredicting(false);
      return;
    }

    try {
      const lastYear = Math.max(...countryData.map(d => d.year));
      // Provide recent data as context for a better prediction
      const recentData = countryData.slice(-10).map(({ year, pop }) => ({ year, pop }));

      const prompt = `Based on the following historical population data for ${selectedCountry} (recent entries: ${JSON.stringify(recentData)}), predict the population for the years from ${lastYear + 1} to 2025. Only provide the predicted data.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.NUMBER, description: "The prediction year." },
                pop: { type: Type.NUMBER, description: "The predicted population number." },
              },
              required: ["year", "pop"],
            },
          },
        },
      });

      const predictionText = response.text;
      const predictedValues = JSON.parse(predictionText) as { year: number; pop: number }[];

      if (!Array.isArray(predictedValues)) throw new Error("Prediction API did not return an array.");

      const newPredictedData: GapminderData[] = predictedValues.map(p => ({
        country: selectedCountry,
        continent: countryData[0]?.continent || '',
        year: p.year,
        pop: p.pop,
        lifeExp: 0,
        gdpPercap: 0,
        iso_alpha: countryData[0]?.iso_alpha || '',
        iso_num: countryData[0]?.iso_num || 0,
        predicted: true,
      }));

      setData(prevData => [...prevData.filter(d => !d.predicted), ...newPredictedData]);

    } catch (err) {
      console.error("Prediction failed:", err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to generate prediction: ${message}`);
      setShowPrediction(false); // uncheck the box on error
    } finally {
      setPredicting(false);
    }
  }, [originalData, selectedCountry]);

  useEffect(() => {
    // Re-run prediction when country changes if the toggle is active
    if (showPrediction) {
        handlePredictionToggle(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, showPrediction]);


  const filteredData = useMemo(() => {
    return data
      .filter(item => item.country === selectedCountry)
      .sort((a, b) => a.year - b.year);
  }, [data, selectedCountry]);

  const lastHistoricalYear = useMemo(() => {
    const historicalData = filteredData.filter(d => !d.predicted);
    return historicalData.length > 0 ? Math.max(...historicalData.map(d => d.year)) : undefined;
  }, [filteredData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-xl text-gray-400">Loading Data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 text-center bg-red-900 border border-red-500 rounded-lg">
          <h2 className="text-2xl font-bold text-red-200">An Error Occurred</h2>
          <p className="mt-2 text-red-300">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 mt-4 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col items-center justify-center w-full md:flex-row">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <CountrySelector 
              countries={countries} 
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              disabled={loading || predicting}
            />
          </div>
          <div className="flex items-center mt-4 md:mt-0 md:ml-6">
            <input
              type="checkbox"
              id="predict-checkbox"
              checked={showPrediction}
              onChange={(e) => handlePredictionToggle(e.target.checked)}
              disabled={loading || predicting}
              className="w-5 h-5 text-indigo-500 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-900"
              aria-describedby="predict-description"
            />
            <label htmlFor="predict-checkbox" className="ml-2 text-gray-300">
              Predict to 2025
            </label>
            {predicting && (
                <svg className="w-5 h-5 ml-2 text-indigo-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
          </div>
        </div>
        <div className="w-full mt-8">
          <PopulationChart data={filteredData} country={selectedCountry} lastHistoricalYear={lastHistoricalYear} />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container p-4 mx-auto sm:p-6 lg:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            تطبيق داش بسيط
          </h1>
          <p className="mt-2 text-lg text-gray-400">Interactive Population Growth Visualizer</p>
        </header>
        <div className="flex flex-col items-center w-full">
          {renderContent()}
        </div>
      </main>
      <footer className="py-4 text-sm text-center text-gray-500">
        <p>Data courtesy of Gapminder. Predictions by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;