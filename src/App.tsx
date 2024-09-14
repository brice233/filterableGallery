import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import PestDetailsPage from "./components/PestDetailsPage";

// Placeholder components for each page
const About = () => <h1>About Page</h1>;
const ContactUs = () => <h1>Contact Us Page</h1>;

const App = () => {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-900 text-white">
        <nav className="p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-300">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pests/:id" element={<PestDetailsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
