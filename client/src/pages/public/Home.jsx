import { Link } from "react-router-dom";
import { Zap, Users, Briefcase, CheckCircle } from "lucide-react";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Next Great Opportunity
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            QuickHire AI connects talented job seekers with amazing employers. 
            Get hired faster with our intelligent matching platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose QuickHire?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Zap className="w-10 h-10 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Fast Applications
              </h3>
              <p className="text-gray-600">
                Apply to jobs in seconds with your saved profile
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Users className="w-10 h-10 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Get matched with opportunities tailored to your skills
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <Briefcase className="w-10 h-10 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Diverse Roles
              </h3>
              <p className="text-gray-600">
                Explore thousands of jobs from startups to enterprises
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <CheckCircle className="w-10 h-10 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Fair Process
              </h3>
              <p className="text-gray-600">
                Transparent hiring process with real feedback
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Hired?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse thousands of job opportunities and start your career journey today.
          </p>
          <Link
            to="/jobs"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            Explore Jobs Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;