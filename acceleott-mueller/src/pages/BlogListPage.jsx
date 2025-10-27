import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "Why Every Clinic Needs a Digital CRM",
    date: "Sep 9, 2025",
    author: "Team Acceleott",
    image: "/images/blog1.jpg",
  },
  {
    id: 2,
    title: "Boosting Patient Trust with Secure Data",
    date: "Aug 29, 2025",
    author: "Dr. Neha Sharma",
    image: "/images/blog2.jpg",
  },
  {
    id: 3,
    title: "How AIMMED Reminds Patients Like Magic",
    date: "Aug 21, 2025",
    author: "Darpan Acharya",
    image: "/images/blog3.jpg",
  },
];

export default function BlogListPage() {
  return (
    <div
      className="py-24 px-6 lg:px-16 max-w-6xl mx-auto"
      style={{ color: "black", fontFamily: "Times New Roman, serif" }}
    >
      <h1 className="text-4xl font-bold mb-10 text-center">All Blog Posts</h1>
      <div className="grid md:grid-cols-3 gap-10">
        {blogPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm mb-4">{post.date} • {post.author}</p>
              <Link
                to={`/blogs/${post.id}`}
                className="underline font-semibold hover:opacity-80"
                style={{ color: "black" }}
              >
                Read More →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
