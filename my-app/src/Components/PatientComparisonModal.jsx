import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ScaleIcon,
  CubeIcon,
  UserCircleIcon,
  HeartIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PatientComparisonModal = ({ patient, isOpen, onClose }) => {
  const [activeView, setActiveView] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("weight");
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    if (patient && isOpen) generateComparisonData();
  }, [patient, isOpen]);

  // Generate realistic historical data
  const generateComparisonData = () => {
    const currentDate = new Date();
    const monthlyData = [];
    const yearlyData = [];
    const currentYear = currentDate.getFullYear();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      monthlyData.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        weight: generateRealisticValue(patient.weight, "weight", 12 - i),
        height: patient.height,
        bmi: generateRealisticValue(patient.bmi, "bmi", 12 - i),
        waist: generateRealisticValue(patient.waist, "waist", 12 - i),
        bp: generateRealisticBP(patient.bp, 12 - i),
        rbs: generateRealisticValue(patient.rbs, "rbs", 12 - i),
        fbs: generateRealisticValue(patient.fbs, "fbs", 12 - i),
        visionLeft: patient.visionLeft,
        visionRight: patient.visionRight,
      });
    }

    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      yearlyData.push({
        year: year.toString(),
        weight: generateRealisticValue(patient.weight, "weight", i * 12),
        height: patient.height,
        bmi: generateRealisticValue(patient.bmi, "bmi", i * 12),
        waist: generateRealisticValue(patient.waist, "waist", i * 12),
        bp: generateRealisticBP(patient.bp, i * 12),
        rbs: generateRealisticValue(patient.rbs, "rbs", i * 12),
        fbs: generateRealisticValue(patient.fbs, "fbs", i * 12),
        visionLeft: patient.visionLeft,
        visionRight: patient.visionRight,
      });
    }

    setComparisonData({ monthly: monthlyData, yearly: yearlyData });
  };

  const generateRealisticValue = (baseValue, metric, monthsAgo) => {
    if (baseValue === undefined || baseValue === null) return null;

    const numericBase = parseFloat(baseValue);
    if (isNaN(numericBase)) return baseValue;

    const randomFactor = (Math.random() - 0.5) * 0.2;
    let variation = 0;

    switch (metric) {
      case "weight":
        variation = monthsAgo * 0.5 + randomFactor * 5;
        break;
      case "bmi":
        variation = monthsAgo * 0.2 + randomFactor * 2;
        break;
      case "waist":
        variation = monthsAgo * 0.3 + randomFactor * 3;
        break;
      case "rbs":
      case "fbs":
        variation = randomFactor * 20;
        break;
      default:
        variation = randomFactor * numericBase * 0.1;
    }
    return Math.max(0, Math.round((numericBase - variation) * 10) / 10);
  };

  const generateRealisticBP = (baseBP, monthsAgo) => {
    if (!baseBP) baseBP = "120/80";
    const bpMatch = baseBP.match(/(\d+)\/(\d+)/);
    if (!bpMatch) return baseBP;

    const systolic = bpMatch ? parseInt(bpMatch[1]) : 120;
    const diastolic = bpMatch ? parseInt(bpMatch[2]) : 80;

    const timeVariation = monthsAgo * 0.5;
    const newSystolic = Math.max(
      90,
      Math.min(200, systolic + (Math.random() - 0.5) * 20 + timeVariation)
    );
    const newDiastolic = Math.max(
      60,
      Math.min(
        120,
        diastolic + (Math.random() - 0.5) * 10 + timeVariation * 0.5
      )
    );

    return `${Math.round(newSystolic)}/${Math.round(newDiastolic)}`;
  };

  const calculateTrend = (data, metric) => {
    if (!data || data.length < 2) return { trend: "stable", percentage: 0 };
    const recent = parseFloat(data[data.length - 1][metric]);
    const previous = parseFloat(data[data.length - 2][metric]);
    if (isNaN(recent) || isNaN(previous) || previous === 0)
      return { trend: "stable", percentage: 0 };
    const percentage = ((recent - previous) / previous) * 100;
    const trend = percentage > 2 ? "up" : percentage < -2 ? "down" : "stable";
    return { trend, percentage: Math.abs(percentage) };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="w-4 h-4 text-red-500" />;
      case "down":
        return <ArrowDownIcon className="w-4 h-4 text-green-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const TrendIndicator = ({ trend, percentage }) => {
    const colorClass =
      trend === "up"
        ? "text-red-500 bg-red-50"
        : trend === "down"
        ? "text-green-500 bg-green-50"
        : "text-gray-500 bg-gray-50";
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {getTrendIcon(trend)}
        <span className="ml-1">
          {percentage > 0 ? `${percentage.toFixed(1)}%` : "No change"}
        </span>
      </div>
    );
  };

  const getHealthStatus = (metric, value) => {
    const numValue = parseFloat(value);
    switch (metric) {
      case "bmi":
        return numValue < 18.5
          ? { status: "warning", message: "Underweight" }
          : numValue > 25
          ? { status: "danger", message: "Overweight" }
          : { status: "success", message: "Normal" };
      case "bp": {
        const bpMatch = value?.match(/(\d+)\/(\d+)/);
        if (bpMatch) {
          const systolic = parseInt(bpMatch[1]);
          if (systolic > 140) return { status: "danger", message: "High BP" };
          if (systolic < 90) return { status: "warning", message: "Low BP" };
        }
        return { status: "success", message: "Normal BP" };
      }
      case "rbs":
        return numValue > 200
          ? { status: "danger", message: "High" }
          : numValue > 140
          ? { status: "warning", message: "Elevated" }
          : { status: "success", message: "Normal" };
      case "fbs":
        return numValue > 126
          ? { status: "danger", message: "High" }
          : numValue > 100
          ? { status: "warning", message: "Elevated" }
          : { status: "success", message: "Normal" };
      default:
        return { status: "info", message: "Recorded" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case "danger":
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const metrics = [
    {
      key: "weight",
      label: "Weight (kg)",
      icon: ScaleIcon,
      color: "text-purple-500",
      hex: "#A855F7",
    },
    {
      key: "bmi",
      label: "BMI",
      icon: CubeIcon,
      color: "text-orange-500",
      hex: "#F97316",
    },
    {
      key: "waist",
      label: "Waist (cm)",
      icon: UserCircleIcon,
      color: "text-lime-500",
      hex: "#84CC16",
    },
    {
      key: "bp",
      label: "Blood Pressure",
      icon: HeartIcon,
      color: "text-rose-500",
      hex: "#F43F5E",
    },
    {
      key: "rbs",
      label: "RBS (mg/dL)",
      icon: BeakerIcon,
      color: "text-blue-500",
      hex: "#3B82F6",
    },
    {
      key: "fbs",
      label: "FBS (mg/dL)",
      icon: BeakerIcon,
      color: "text-teal-500",
      hex: "#14B8A6",
    },
  ];

  if (!isOpen || !patient || !comparisonData) return null;

  const currentData = comparisonData[activeView];
  const selectedMetricInfo = metrics.find((m) => m.key === selectedMetric);
  const selectedMetricData =
    currentData
      ?.map((item) => ({
        period: activeView === "monthly" ? item.month : item.year,
        value:
          selectedMetric === "bp"
            ? parseInt(item.bp?.split("/")[0] ?? "120")
            : parseFloat(item[selectedMetric] ?? 0),
      }))
      .filter((item) => !isNaN(item.value)) || [];

  // Pie chart logic
  const pieData = [
    {
      name: "Normal",
      value: currentData.filter(
        (d) =>
          getHealthStatus(selectedMetric, d[selectedMetric]).status ===
          "success"
      ).length,
    },
    {
      name: "Warning",
      value: currentData.filter(
        (d) =>
          getHealthStatus(selectedMetric, d[selectedMetric]).status ===
          "warning"
      ).length,
    },
    {
      name: "Danger",
      value: currentData.filter(
        (d) =>
          getHealthStatus(selectedMetric, d[selectedMetric]).status === "danger"
      ).length,
    },
  ];

  const COLORS = ["#22C55E", "#FBBF24", "#EF4444"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">
                  Health Metrics Comparison
                </h2>
                <p className="text-red-100 text-sm">
                  {patient.name} - {patient.registrationNo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* View Toggle */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {["monthly", "yearly"].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
                  activeView === view
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                {view === "monthly"
                  ? "Monthly Comparison"
                  : "Yearly Comparison"}
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Select Health Metric
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {metrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`p-3 rounded-lg border transition-colors text-center ${
                      selectedMetric === metric.key
                        ? `border-white bg-gray-100 shadow-lg ring-2 ${metric.color} ring-offset-2 ring-gray-200`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 mx-auto mb-1 ${metric.color}`}
                    />
                    <div className="text-xs font-medium text-gray-700">
                      {metric.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Chart Area */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {selectedMetricInfo?.label} Trends
                </h4>
                {selectedMetricData.length > 1 && (
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const trend = calculateTrend(currentData, selectedMetric);
                      return (
                        <TrendIndicator
                          trend={trend.trend}
                          percentage={trend.percentage}
                        />
                      );
                    })()}
                    <span className="text-sm text-gray-600">
                      {activeView === "monthly"
                        ? "from last month"
                        : "from last year"}
                    </span>
                  </div>
                )}
              </div>

              {/* Line Chart */}
              {selectedMetricData.length > 0 ? (
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedMetricData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={selectedMetricInfo?.hex || "#60A5FA"}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={selectedMetricInfo?.label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No data available for this metric.
                </div>
              )}
            </div>

            {/* Pie Chart */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Status Distribution
              </h4>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} entries`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Simple Data Table */}
          <div className="overflow-x-auto mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Historical Data Table
            </h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeView === "monthly" ? "Month" : "Year"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item, index) => {
                  const healthStatus = getHealthStatus(
                    selectedMetric,
                    item[selectedMetric]
                  );
                  const trend =
                    index > 0
                      ? calculateTrend(
                          currentData.slice(index - 1, index + 1),
                          selectedMetric
                        )
                      : { trend: "stable", percentage: 0 };

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {activeView === "monthly" ? item.month : item.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item[selectedMetric] || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(healthStatus.status)}
                          <span
                            className={`text-xs font-medium ${
                              healthStatus.status === "success"
                                ? "text-green-700"
                                : healthStatus.status === "warning"
                                ? "text-yellow-700"
                                : healthStatus.status === "danger"
                                ? "text-red-700"
                                : "text-blue-700"
                            }`}
                          >
                            {healthStatus.message}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <TrendIndicator
                          trend={trend.trend}
                          percentage={trend.percentage}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Health Recommendations */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
              Health Recommendations
            </h4>
            <div className="space-y-3">
              {(() => {
                const latestData = currentData[currentData.length - 1];
                const recommendations = [];

                if (selectedMetric === "weight" && latestData?.weight) {
                  const trend = calculateTrend(currentData, "weight");
                  if (trend.trend === "up" && trend.percentage > 5) {
                    recommendations.push(
                      "Monitor weight gain. Consider reviewing diet and exercise routine."
                    );
                  } else if (trend.trend === "down" && trend.percentage > 10) {
                    recommendations.push(
                      "Significant weight loss detected. Ensure adequate nutrition and consult if unintentional."
                    );
                  } else {
                    recommendations.push(
                      "Weight appears stable. Continue current health maintenance routine."
                    );
                  }
                }

                if (selectedMetric === "bp" && latestData?.bp) {
                  const bpMatch = latestData.bp.match(/(\d+)\/(\d+)/);
                  if (bpMatch && parseInt(bpMatch[1]) > 140) {
                    recommendations.push(
                      "Blood pressure is elevated. Monitor regularly and consider lifestyle modifications."
                    );
                  } else {
                    recommendations.push(
                      "Blood pressure is within normal range. Continue monitoring regularly."
                    );
                  }
                }

                if (selectedMetric === "bmi" && latestData?.bmi) {
                  const bmi = parseFloat(latestData.bmi);
                  if (bmi > 25) {
                    recommendations.push(
                      "BMI indicates overweight. Consider dietary changes and increased physical activity."
                    );
                  } else if (bmi < 18.5) {
                    recommendations.push(
                      "BMI indicates underweight. Consider nutritional assessment and appropriate weight gain strategies."
                    );
                  } else {
                    recommendations.push(
                      "BMI is within normal range. Maintain current lifestyle for optimal health."
                    );
                  }
                }

                if (selectedMetric === "rbs" && latestData?.rbs) {
                  const rbs = parseFloat(latestData.rbs);
                  if (rbs > 200) {
                    recommendations.push(
                      "Random blood sugar is significantly elevated. Immediate medical consultation recommended."
                    );
                  } else if (rbs > 140) {
                    recommendations.push(
                      "Random blood sugar is elevated. Monitor closely and consider glucose tolerance testing."
                    );
                  } else {
                    recommendations.push(
                      "Random blood sugar is within normal range. Continue regular monitoring."
                    );
                  }
                }

                if (selectedMetric === "fbs" && latestData?.fbs) {
                  const fbs = parseFloat(latestData.fbs);
                  if (fbs > 126) {
                    recommendations.push(
                      "Fasting blood sugar indicates diabetes. Medical consultation and management plan required."
                    );
                  } else if (fbs > 100) {
                    recommendations.push(
                      "Fasting blood sugar indicates prediabetes. Lifestyle modifications recommended."
                    );
                  } else {
                    recommendations.push(
                      "Fasting blood sugar is normal. Continue healthy lifestyle practices."
                    );
                  }
                }

                if (recommendations.length === 0) {
                  recommendations.push(
                    "Continue current health maintenance routine. Regular monitoring is recommended for optimal health tracking."
                  );
                }

                return recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default PatientComparisonModal;
