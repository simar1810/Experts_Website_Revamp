'use client';

import { useState, useEffect } from "react";

export default function BMRCalculator() {
  const [unit, setUnit] = useState("metric");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState(""); // for metric/other
  const [feet, setFeet] = useState(""); // for US
  const [inches, setInches] = useState(""); // for US
  const [weight, setWeight] = useState("");
  const [bmr, setBMR] = useState(null);
  const [resultUnit, setResultUnit] = useState("calories");
  const [formula, setFormula] = useState("mifflin");
  const [bodyFat, setBodyFat] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        // Optional reset logic
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;

    if (unit === "metric") {
      if (newUnit === "us") {
        const cm = parseFloat(height);
        if (!isNaN(cm)) {
          const totalInches = cm / 2.54;
          const ft = Math.floor(totalInches / 12);
          const inch = (totalInches % 12).toFixed(2);
          setFeet(ft.toString());
          setInches(inch.toString());
        }
        setHeight("");
        setWeight((prev) =>
          prev ? (parseFloat(prev) * 2.20462).toFixed(2) : ""
        );
      }
    } else if (unit === "us") {
      if (newUnit === "metric") {
        const f = parseFloat(feet);
        const i = parseFloat(inches);
        const totalInches = (f || 0) * 12 + (i || 0);
        setHeight((totalInches * 2.54).toFixed(2));
        setFeet("");
        setInches("");
        setWeight((prev) =>
          prev ? (parseFloat(prev) / 2.20462).toFixed(2) : ""
        );
      }
    }

    if (newUnit !== "us") {
      setFeet("");
      setInches("");
    }
    if (newUnit !== "metric") {
      setHeight("");
    }

    setUnit(newUnit);
  };

  const calculateBMR = () => {
    const a = parseFloat(age);
    const wInput = parseFloat(weight);
    let h;

    if (unit === "metric") {
      h = parseFloat(height);
    } else if (unit === "us") {
      const f = parseFloat(feet);
      const i = parseFloat(inches);
      h = (f || 0) * 12 + (i || 0);
    } else {
      h = parseFloat(height);
    }

    if (isNaN(h) || isNaN(wInput) || isNaN(a)) return;

    let wKg = wInput;
    let hCm = h;
    if (unit === "us") {
      wKg = wInput * 0.453592;
      hCm = h * 2.54;
    }

    let result = 0;

    if (formula === "mifflin") {
      result =
        gender === "male"
          ? 10 * wKg + 6.25 * hCm - 5 * a + 5
          : 10 * wKg + 6.25 * hCm - 5 * a - 161;
    } else if (formula === "harris") {
      result =
        gender === "male"
          ? 13.397 * wKg + 4.799 * hCm - 5.677 * a + 88.362
          : 9.247 * wKg + 3.098 * hCm - 4.330 * a + 447.593;
    } else if (formula === "katch") {
      const bf = parseFloat(bodyFat);
      if (isNaN(bf)) {
        setBMR(null);
        return;
      }
      const lbm = wKg * (1 - bf / 100);
      result = 370 + 21.6 * lbm;
    }

    if (resultUnit === "kilojoules") {
      result *= 4.184;
    }

    setBMR(result.toFixed(2));
  };

  const weightUnitLabel = unit === "metric" ? "kg" : "pounds";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#f5faff] rounded-xl shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-4 text-[#67BC2A] text-center">
        BMR Calculator
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        {["metric", "us", "other"].map((u) => (
          <button
            key={u}
            onClick={() => handleUnitChange(u)}
            className={`px-4 py-2 rounded-full font-medium ${
              unit === u
                ? "bg-[#67BC2A] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {u === "metric"
              ? "Metric"
              : u === "us"
              ? "US Units"
              : "Other Units"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            className="border border-gray-300 p-2 w-full rounded text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded text-gray-900"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {unit === "us" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (feet)
                </label>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  placeholder="Feet"
                  className="border border-gray-300 p-2 w-full rounded text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (inches)
                </label>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  placeholder="Inches"
                  className="border border-gray-300 p-2 w-full rounded text-gray-900"
                />
              </div>
            </>
          ) : (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height ({unit === "metric" ? "cm" : "inches"})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height"
                className="border border-gray-300 p-2 w-full rounded text-gray-900"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight ({weightUnitLabel})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Enter weight in ${weightUnitLabel}`}
            className="border border-gray-300 p-2 w-full rounded text-gray-900"
          />
        </div>
      </div>

      <details className="mb-6">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Settings
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Result Unit
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="resultUnit"
                  value="calories"
                  checked={resultUnit === "calories"}
                  onChange={(e) => setResultUnit(e.target.value)}
                />
                <span className="text-gray-900">Calories</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="resultUnit"
                  value="kilojoules"
                  checked={resultUnit === "kilojoules"}
                  onChange={(e) => setResultUnit(e.target.value)}
                />
                <span className="text-gray-900">Kilojoules</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formula
            </label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="formula"
                  value="mifflin"
                  checked={formula === "mifflin"}
                  onChange={(e) => setFormula(e.target.value)}
                />
                <span className="text-gray-900">Mifflin St Jeor</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="formula"
                  value="harris"
                  checked={formula === "harris"}
                  onChange={(e) => setFormula(e.target.value)}
                />
                <span className="text-gray-900">Revised Harris-Benedict</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="formula"
                  value="katch"
                  checked={formula === "katch"}
                  onChange={(e) => setFormula(e.target.value)}
                />
                <span className="text-gray-900">Katch-McArdle</span>
              </label>
            </div>
          </div>
          {formula === "katch" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Fat %
              </label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="Enter body fat %"
                className="border border-gray-300 p-2 w-full rounded text-gray-900"
              />
            </div>
          )}
        </div>
      </details>

      <button
        onClick={calculateBMR}
        className="bg-[#67BC2A] hover:bg-[#529e22] text-white px-6 py-2 rounded font-semibold w-full"
      >
        Calculate BMR
      </button>

      {bmr && (
        <p className="mt-4 text-center text-lg font-semibold text-[#67BC2A]">
          Your BMR is: {bmr}{" "}
          {resultUnit === "calories" ? "calories/day" : "kilojoules/day"}
        </p>
      )}
    </div>
  );
}
