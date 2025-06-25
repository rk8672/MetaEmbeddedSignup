const plans = [
  {
    name: "Starter",
    price: "₹0",
    subPrice: "for first 3 months",
    afterTrial: "Then ₹999 Per Month",
    features: [
      "Online Appointment Booking",
      "Doctor Availability Display",
      "WhatsApp & SMS Alerts",
    ],
    highlight: "Best for trial use",
  },
  {
    name: "Small Hospital",
    price: "₹999",
    subPrice: "Per Month",
    features: [
      "Everything in Starter",
      "Staff Attendance & Salary",
      "Basic Billing & Invoicing",
      "OPD Token Management",
    ],
    highlight: "Perfect for small hospitals",
  },
  {
    name: "Medium Hospital",
    price: "₹2999",
    subPrice: "Per Month",
    features: [
      "Everything in Small Plan",
      "Advanced Reporting & Analytics",
      "Multi-Branch Support",
      "Data Backup & Priority Support",
    ],
    highlight: "Best for scaling",
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 mt-4">Flexible pricing for every stage of your hospital's growth</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 px-6 lg:px-20">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md p-8 border border-gray-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <h3 className="text-2xl font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-4xl mt-4 font-extrabold text-gray-900">{plan.price}</p>
            <p className="text-gray-500">{plan.subPrice}</p>
            {plan.afterTrial && (
              <p className="text-sm mt-1 text-gray-600 italic">{plan.afterTrial}</p>
            )}
            <p className="mt-4 text-sm text-gray-700 font-medium">{plan.highlight}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <span className="mr-2 text-green-500">✔</span>{feature}
                </li>
              ))}
            </ul>

            <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
