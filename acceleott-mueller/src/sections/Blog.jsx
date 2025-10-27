import React from 'react';
import { useNavigate } from 'react-router-dom';
import './blog.css';

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "Digital CRM for Modern Clinics",
      summary:
        "In today’s fast-paced healthcare environment, managing patient relationships efficiently is no longer a luxury—it’s a necessity. Modern clinics are increasingly adopting Digital CRM (Customer Relationship Management) systems to streamline operations, enhance patient care, and drive overall clinic performance. But what exactly makes a digital CRM indispensable for today’s clinics?",
    },
    {
      id: 2,
      title: "Why Automation Matters in Clinics",
      summary:
        "Healthcare today moves at a rapid pace, and clinics are under constant pressure to deliver high-quality care while managing administrative tasks efficiently. Manual processes—like scheduling, record-keeping, and follow-ups—can be time-consuming and error-prone. This is where automation in clinics plays a crucial role, transforming how healthcare professionals work and how patients experience care.",
    },
    {
      id: 3,
      title: "Why Automation Matters in Clinics",
      summary:
        "Discover how automation reduces manual work, streamlines operations, and lets doctors focus on what matters most – patient care.",
    },
  ];

  return (
    <section className="blog-section" id="blogs">
      <div className="container">
        {/* Section Heading */}
        <h2 className="heading" data-aos="fade-up">
          From Our Blog
        </h2>

        {/* Blog Cards */}
        <div className="pill-grid">
          {blogPosts.map((post, index) => (
            <article
              className="pill blog-card"
              key={post.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <button
                className="read-more-btn"
                onClick={() => navigate(`/blog/${post.id}`)}
                aria-label={`Read more about ${post.title}`}
              >
                Read more →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
