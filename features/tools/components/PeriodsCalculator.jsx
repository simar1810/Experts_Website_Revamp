'use client';
import React, { useReducer } from 'react';
import { CalendarDays, Utensils } from 'lucide-react';



// Initial state for the reducer
const initialState = {
  firstDay: '',
  periodLength: 5,
  cycleLength: 28,
  results: null,
  error: null,
};

// Reducer function to manage state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIRST_DAY':
      return { ...state, firstDay: action.payload, error: null };
    case 'SET_PERIOD_LENGTH':
      return { ...state, periodLength: action.payload, error: null };
    case 'SET_CYCLE_LENGTH':
      return { ...state, cycleLength: action.payload, error: null };
    case 'CALCULATE':
      try {
        const { firstDay, periodLength, cycleLength } = state;
        if (!firstDay || periodLength <= 0 || cycleLength <= 0) {
          throw new Error('Please fill out all fields with valid numbers.');
        }

        const firstPeriodStart = new Date(firstDay);
        if (isNaN(firstPeriodStart.getTime())) {
          throw new Error('Invalid date format. Please use a valid date.');
        }

        const periods = [];
        const ovulations = [];
        const importantDates = [];
        let currentPeriodStart = new Date(firstPeriodStart);

        // Calculate the next 6 cycles based on the first day
        for (let i = 0; i < 6; i++) {
          // Calculate period start and end
          const periodStart = new Date(currentPeriodStart);
          const periodEnd = new Date(periodStart);
          periodEnd.setDate(periodStart.getDate() + periodLength - 1);
          periods.push({ start: periodStart, end: periodEnd });

          // Calculate ovulation start and end (assumed 14 days before next period)
          const ovulationStart = new Date(periodStart);
          ovulationStart.setDate(periodStart.getDate() + (cycleLength - 14) - 2);
          const ovulationEnd = new Date(ovulationStart);
          ovulationEnd.setDate(ovulationStart.getDate() + 4);
          ovulations.push({ start: ovulationStart, end: ovulationEnd });

          // Add important date for next cycle
          importantDates.push({
            period: `${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`,
            ovulation: `${ovulationStart.toLocaleDateString()} - ${ovulationEnd.toLocaleDateString()}`,
          });

          // Move to the next cycle
          currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
        }

        // Generate calendars for the next 6 months starting from the first day
        const generateCalendars = (startDate, numMonths) => {
          const calendars = {};
          const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

          for (let i = 0; i < numMonths; i++) {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday

            const days = [];
            for (let j = 0; j < firstDayOfWeek; j++) {
              days.push(null); // Placeholder for empty days
            }

            for (let day = 1; day <= daysInMonth; day++) {
              days.push(new Date(year, month, day));
            }
            calendars[monthName] = days;
            currentMonth.setMonth(month + 1);
          }
          return calendars;
        };
        
        const nextCalendars = generateCalendars(firstPeriodStart, 6);

        return {
          ...state,
          results: {
            nextCalendars,
            periods,
            ovulations,
            importantDates,
          },
          error: null
        };
      } catch (error) {
        return { ...state, error: error.message, results: null };
      }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export default function PeriodsCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Helper function to check if a date falls within a range
  const isDateInRange = (date, ranges) => {
    return ranges.some(range => date >= range.start && date <= range.end);
  };

  const renderCalendar = (monthName, days) => {
    const { periods, ovulations } = state.results;

    return (
      <div key={monthName} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner flex-1">
        <h3 className="text-lg font-bold text-center mb-2 text-gray-800 dark:text-white">{monthName}</h3>
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-8 w-8"></div>;
            }

            const isPeriodDay = isDateInRange(day, periods);
            const isOvulationDay = isDateInRange(day, ovulations);

            let dayClasses = "h-8 w-8 rounded-full flex items-center justify-center text-gray-800 dark:text-white text-sm font-medium";
            if (isPeriodDay) {
              dayClasses += " bg-pink-200 text-pink-800 font-bold";
            } else if (isOvulationDay) {
              dayClasses += " bg-orange-200 text-orange-800 font-bold";
            }

            return (
              <div key={index} className="py-1 flex items-center justify-center">
                <span className={dayClasses}>
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <style>{`
        /* Custom Tailwind config for the specified green color */
        @layer base {
          :root {
            --green-primary: #67BC2A;
          }
        }
        .text-green-primary {
          color: var(--green-primary);
        }
        .bg-green-primary {
          background-color: var(--green-primary);
        }
        .border-green-primary {
          border-color: var(--green-primary);
        }
        .hover\\:bg-green-700:hover {
          background-color: #559c23;
        }
      `}</style>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-green-primary mt-8 mb-4">
          Period Calculator
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Use this calculator to estimate the future period days or the most probable ovulation days.
        </p>

        {/* Form Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label htmlFor="firstDay" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                First Day of Your Last Period:
              </label>
              <input
                type="date"
                id="firstDay"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 shadow-sm focus:border-green-primary focus:ring-green-primary transition-colors"
                value={state.firstDay}
                onChange={(e) => dispatch({ type: 'SET_FIRST_DAY', payload: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="periodLength" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                How long did it last?
              </label>
              <input
                type="number"
                id="periodLength"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 shadow-sm focus:border-green-primary focus:ring-green-primary transition-colors"
                value={state.periodLength}
                onChange={(e) => dispatch({ type: 'SET_PERIOD_LENGTH', payload: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="cycleLength" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Average Length of Cycles:
              </label>
              <input
                type="number"
                id="cycleLength"
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 shadow-sm focus:border-green-primary focus:ring-green-primary transition-colors"
                value={state.cycleLength}
                onChange={(e) => dispatch({ type: 'SET_CYCLE_LENGTH', payload: parseInt(e.target.value) })}
              />
            </div>
            <button
              onClick={() => dispatch({ type: 'CALCULATE' })}
              className="w-full bg-green-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-colors"
            >
              Calculate
            </button>
          </div>
          {state.error && (
            <p className="mt-4 text-center text-red-500 font-medium">
              {state.error}
            </p>
          )}
        </section>

        {/* Results Section */}
        {state.results && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
              Result
            </h2>
            
            {/* Calendar View */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(state.results.nextCalendars).map(([monthName, days]) =>
                  renderCalendar(monthName, days)
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center space-x-4 text-sm mt-6">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-pink-200"></div>
                  <span className="text-gray-700 dark:text-gray-300">Period Days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-orange-200"></div>
                  <span className="text-gray-700 dark:text-gray-300">Most Probable Ovulation Days</span>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Important dates for the next 6 cycles.</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Cycle</th>
                      <th scope="col" className="px-6 py-3">Period</th>
                      <th scope="col" className="px-6 py-3">Most Probable Ovulation Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.results.importantDates.map((date, index) => (
                      <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="px-6 py-4 font-bold">{index + 1}</td>
                        <td className="px-6 py-4">{date.period}</td>
                        <td className="px-6 py-4">{date.ovulation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Menstrual Cycle Explanation */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center mb-4">
            <Utensils className="mr-3 text-green-primary" size={32} />
            Menstrual cycle
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            The menstrual cycle is a series of changes that occur in a woman’s body as part of the preparation for the possibility of pregnancy occurring. It is a cycle that usually begins between 12 and 15 years of age that continues up until menopause, which, on average, occurs at the age of 52. The menstrual cycle is typically counted from the first day of one period to the first day of the next. It is controlled by the rise and fall of hormones. The length of a woman’s menstrual cycle varies. A regular menstrual cycle is considered to be a menstrual cycle where the longest and shortest cycles vary by less than 8 days. The average menstrual cycle lasts 28 days.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            As part of the menstrual cycle, the lining of the uterus thickens, and an egg, which is required for pregnancy to occur, is produced. The egg is released from the ovaries in a process called ovulation, which corresponds with the time during which a woman is most fertile (5 days before ovulation, up through 1-2 days after ovulation). If the egg is not fertilized, pregnancy cannot happen, and the lining of the uterus will shed during a menstrual period, after which the cycle restarts.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            A period, a commonly used term for referring to menstruation, is a woman’s regular discharge of blood and mucosal tissue that occurs as part of the menstrual cycle. Bleeding and discharge of the mucosal lining of the uterus, through the vagina, usually lasts between 2 and 7 days. It occurs in the early phases of the menstrual cycle, referred to as the menstrual phase, which begins when the egg from a previous cycle is not fertilized. Periods stop during pregnancy, and typically do not resume during the early stages of breastfeeding. Periods also eventually stop permanently during menopause, usually between the ages of 49 and 52, and can be defined as having no vaginal bleeding for a year.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            The Period Calculator estimates period days and the most probable ovulation days in calendar form. Period days are the days during which bleeding and discharge occur. The most probable ovulation days are the days during which a woman is most likely to ovulate.
          </p>
        </section>
      </main>
    </div>
  );
}
