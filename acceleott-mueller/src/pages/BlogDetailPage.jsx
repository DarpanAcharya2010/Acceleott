import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./blogdetail.css";

/**
 * Ideally, this data should come from an API or CMS.
 * For demo purposes, it's kept static and exportable.
 */
const mockPosts = [
  {
    id: "1",
    title: "Digital CRM for Modern Clinics",
    image: "/images/crm-clinic.jpg",
    content: `What is a Digital CRM?

A Digital CRM is a software platform that allows clinics to manage patient interactions, track appointments, store medical histories, and centralize all communication in one place. Unlike traditional pen-and-paper methods or scattered spreadsheets, a digital CRM offers real-time insights, secure data storage, and automation tools that save time and reduce errors.

Why Modern Clinics Need a Digital CRM

Streamlined Patient Management
Managing patients manually can be overwhelming, especially in clinics with high patient volumes. Digital CRMs organize patient records, lab results, prescriptions, and appointment schedules in one centralized system, making it easier for doctors and staff to access accurate information instantly.

Improved Communication
From appointment reminders to follow-up notifications, digital CRMs allow clinics to communicate seamlessly with patients. Automated messages reduce no-shows, improve engagement, and foster stronger patient relationships.

Data Security and Compliance
Patient information is sensitive and must be handled securely. Modern digital CRMs offer encrypted storage, role-based access, and audit trails to ensure compliance with medical data regulations, giving both staff and patients peace of mind.

Efficient Workflow Automation
Routine tasks such as appointment scheduling, reminders, and patient follow-ups can be automated, allowing clinic staff to focus on critical tasks like patient care. Automation reduces errors and enhances overall efficiency.

Actionable Insights with Analytics
A CRM isn’t just a storage tool; it’s a powerful analytics engine. Clinics can monitor appointment trends, patient demographics, and treatment outcomes. With these insights, administrators can make informed decisions to improve clinic performance and patient satisfaction.

Conclusion

A Digital CRM for modern clinics is no longer optional—it’s essential. From streamlining patient management and automating workflows to improving communication and providing actionable insights, a CRM transforms the way clinics operate. By adopting a robust digital CRM, clinics can focus on what matters most: delivering high-quality patient care, building strong relationships, and operating efficiently in today’s competitive healthcare environment.`,
  },
  {
    id: "2",
    title: "Why Automation Matters in Clinics",
    image: "/images/automation.jpg",
    content: `Streamlining Daily Operations
One of the primary benefits of automation is the ability to streamline daily operations.

Tasks such as appointment scheduling, reminders, and patient follow-ups can be automated, freeing staff to focus on direct patient care. Automated workflows reduce human error, minimize miscommunications, and ensure that the clinic operates smoothly even during peak hours.

Enhancing Patient Experience
Automation is not just about efficiency—it’s also about improving patient satisfaction.

Automated appointment reminders, notifications for test results, and follow-up messages keep patients informed and engaged. This reduces missed appointments, accelerates treatment timelines, and makes patients feel valued, creating a positive impression of the clinic.

Improving Accuracy and Compliance
Handling sensitive patient information requires precision and strict adherence to privacy regulations. Automation ensures that patient records are accurately stored and updated in real-time, with secure access controls. Automated systems help clinics remain compliant with healthcare regulations like HIPAA, protecting both patients and the clinic from potential risks.

Data-Driven Insights
Automated systems can generate reports and analytics effortlessly, giving clinics actionable insights into their operations. From tracking patient flow to analyzing treatment outcomes and staff performance, automation enables informed decision-making. Clinics can identify bottlenecks, optimize schedules, and improve overall efficiency based on real-time data.

Saving Time and Reducing Costs
Time is money, especially in a busy clinic. Automation reduces the time spent on repetitive administrative tasks, lowering operational costs and increasing productivity. Staff can allocate more attention to patient care, which enhances service quality and clinic reputation.

Conclusion
Automation is no longer a luxury—it is essential for modern clinics aiming to provide high-quality care efficiently. By streamlining operations, enhancing patient experience, ensuring compliance, providing data-driven insights, and saving time, automation allows clinics to focus on what truly matters: delivering exceptional healthcare. Embracing automated solutions transforms clinics into agile, patient-focused environments ready to meet the demands of today and tomorrow.`,
  },
  {
    id: "3",
    title: "Future of AI in Healthcare",
    image: "/images/ai-health.jpg",
    content: `AI is revolutionizing healthcare by improving diagnostics, treatment planning, and patient monitoring. The integration of machine learning models allows faster and more accurate decisions for both doctors and patients.`,
  },
];

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // ✅ Simulate fetching from backend or static data
    const foundPost = mockPosts.find((p) => p.id === id);
    if (!foundPost) {
      // Graceful fallback if ID is invalid
      navigate("/404", { replace: true });
    } else {
      setPost(foundPost);
    }
  }, [id, navigate]);

  if (!post) return null;

  // ✅ Improved paragraph splitting logic (handles line breaks, empty spaces, and punctuation)
  const paragraphs = post.content
    .split(/(?:\n\s*\n|(?<=\.)\s+(?=[A-Z]))/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="blog-detail-container">
      <article className="blog-text">
        <h1 className="blog-title">{post.title}</h1>
        {paragraphs.map((para, index) => (
          <p key={index} className="blog-paragraph">
            {para}
          </p>
        ))}
      </article>

      <div className="blog-image-container">
        <img
          src={post.image}
          alt={post.title}
          className={`blog-image ${loaded ? "fade-in" : "loading"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy" // ✅ Better performance
          decoding="async"
        />
      </div>
    </main>
  );
};

export default React.memo(BlogDetailPage);
