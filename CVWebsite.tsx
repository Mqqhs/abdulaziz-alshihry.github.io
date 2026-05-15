import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code, FileText, Menu, X, Download } from 'lucide-react';

interface CVData {
  personalInfo: {
    name: string;
    title: string;
    location: string;
    phone: string;
    email: string;
  };
  summary: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    period: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  courses: {
    name: string;
    period: string;
    institution: string;
    platform: string;
  }[];
}

const initialCVData: CVData = {
  personalInfo: {
    name: "Abdulaziz Al shihry",
    title: "Programmer & Web Developer",
    location: "Dammam, Saudi Arabia",
    phone: "(966)507376132",
    email: "Abdulaziz.alshihry@hotmail.com"
  },
  summary: "Diploma graduate from the College of Technology in Dammam, specializing in programming technology and web development. I have certificates, including cybersecurity, as well as an Internet of Things certificate from the international Cisco organization. I love to constantly learn programming codes.",
  skills: [
    "Java 1",
    "HTML 2",
    "Databases 3",
    "PHP 4",
    "C# 5",
    "JavaScript 6",
    "C++ 7",
    "UML 8",
    "Excel 9",
    "Python 10"
  ],
  education: [
    {
      degree: "Diploma of programing and Web Development",
      institution: "College of Technology, Dammam",
      period: "Sep/2022-May/2024"
    }
  ],
  experience: [
    {
      title: "Computer Programmer / IT Support",
      company: "Eastern Province Emirate - Information Technology Department",
      duration: "10 Months",
      description: "Provided technical support for internal systems and applications, assisted employees in resolving system-related issues, and ensured smooth operation of IT services. Worked directly with users to support and maintain government systems in accordance with organizational policies and procedures"
    }
  ],
  courses: [
    {
      name: "Occupational Safety",
      period: "July/2024-July/2024",
      institution: "College of technology of Dammam",
      platform: "Online"
    },
    {
      name: "Programming using Python",
      period: "July/2024-July/2024",
      institution: "College of technology of Dammam",
      platform: "Online"
    },
    {
      name: "Excel",
      period: "Aug/2024-Aug/2024",
      institution: "Hadaf",
      platform: "Online"
    },
    {
      name: "Java",
      period: "Aug/2024-Aug/2024",
      institution: "College of technology of Dammam",
      platform: "Online"
    },
    {
      name: "Pass the job interview successfully",
      period: "Aug/2024-Aug/2024",
      institution: "Hadaf",
      platform: "Online"
    },
    {
      name: "Developing career opportunities",
      period: "Aug/2024-Aug/2024",
      institution: "Hadaf",
      platform: "Online"
    },
    {
      name: "Cyber security",
      period: "Sep/2023-Jan/2024",
      institution: "Cisco",
      platform: "Online"
    },
    {
      name: "IoT",
      period: "Sep/2023-Jan/2024",
      institution: "Cisco",
      platform: "Online"
    },
    {
      name: "Artificial intelligence",
      period: "Sep/2023-Jan/2024",
      institution: "Huawei",
      platform: "Online"
    },
    {
      name: "Information Security",
      period: "Jan/2023-Jan/2023",
      institution: "Doroob",
      platform: "Online"
    },
    {
      name: "Cloud computing security",
      period: "Jan/2023-Jan/2023",
      institution: "Doroob",
      platform: "Online"
    },
    {
      name: "Digital forensic investigation",
      period: "Jan/2023-Jan/2023",
      institution: "Digital giving",
      platform: "Online"
    },
    {
      name: "Information security strategy",
      period: "Jan/2023-Jan/2023",
      institution: "Digital giving",
      platform: "Online"
    },
    {
      name: "Best practices in protecting the home network",
      period: "Jan/2023-Jan/2023",
      institution: "Digital giving",
      platform: "Online"
    }
  ]
};

export default function CVWebsite() {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  // Set browser tab title and meta tags
  useEffect(() => {
    document.title = `${cvData.personalInfo.name} - CV`;

    // Update meta description for SEO
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', cvData.summary);
  }, [cvData.personalInfo.name, cvData.summary]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadCV = () => {
    alert('CV download functionality - you can implement PDF generation here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl">
              {cvData.personalInfo.name}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('about')}
                className={`hover:text-blue-600 transition-colors ${activeSection === 'about' ? 'text-blue-600' : ''}`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className={`hover:text-blue-600 transition-colors ${activeSection === 'experience' ? 'text-blue-600' : ''}`}
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection('education')}
                className={`hover:text-blue-600 transition-colors ${activeSection === 'education' ? 'text-blue-600' : ''}`}
              >
                Education
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className={`hover:text-blue-600 transition-colors ${activeSection === 'courses' ? 'text-blue-600' : ''}`}
              >
                Courses
              </button>
              <button
                onClick={handleDownloadCV}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CV
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection('education')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Education
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Courses
              </button>
              <button
                onClick={handleDownloadCV}
                className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download CV
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full mb-6">
              <span className="text-5xl text-blue-600">{cvData.personalInfo.name.charAt(0)}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl mb-4">{cvData.personalInfo.name}</h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8">{cvData.personalInfo.title}</p>

            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{cvData.personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{cvData.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${cvData.personalInfo.email}`} className="hover:text-white">
                  {cvData.personalInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl">Summary</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-12">{cvData.summary}</p>

          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl">Skills</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cvData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-3 text-center hover:shadow-md transition-shadow"
              >
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl">Experience</h2>
          </div>

          {cvData.experience.map((exp, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h3 className="text-xl mb-2">{exp.title}</h3>
                  <p className="text-blue-600 mb-1">{exp.company}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                  {exp.duration}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl">Education</h2>
          </div>

          {cvData.education.map((edu, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h3 className="text-xl mb-2">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.institution}</p>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap mt-2 sm:mt-0">
                  {edu.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl">Courses & Certifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvData.courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                <h3 className="mb-3">{course.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>{course.institution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>{course.platform}</span>
                  </div>
                  <div className="text-xs text-gray-500">{course.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">{cvData.personalInfo.name}</p>
          <p className="text-gray-400 text-sm">
            {cvData.personalInfo.email} • {cvData.personalInfo.phone}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © 2024 All rights reserved
          </p>
        </div>
      </footer>

      {/* Edit Mode Button - Hidden for now, can be enabled for editing */}
      {isEditing && (
        <button
          onClick={() => setIsEditing(false)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          Save Changes
        </button>
      )}
    </div>
  );
}
