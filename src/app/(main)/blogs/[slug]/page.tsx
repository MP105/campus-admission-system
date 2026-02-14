'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  User,
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  Bookmark,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react'
import { useBlog } from '@/hooks/useBlogs'

const BlogDetailPage = () => {
  const params = useParams()
  const slug = params.slug as string
  const [scrollProgress, setScrollProgress] = useState(0)

  const { data: blog, isLoading, error, refetch } = useBlog(slug)

  // Scroll Progress Logic
  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setScrollProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }
    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-green-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Preparing your read...</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="mb-6 inline-flex p-4 rounded-2xl bg-red-50 text-red-500">
             <ArrowLeft size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Article M.I.A</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">We couldn't find the piece you're looking for. It might have been moved or deleted.</p>
          <Link href="/blogs">
            <Button className="w-full bg-slate-900 hover:bg-green-600 h-12 rounded-xl transition-all">
              Return to Feed
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20 selection:bg-green-100 selection:text-green-900">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-green-500 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <header className="relative pt-12 pb-16 md:pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blogs" className="group inline-flex items-center text-sm font-bold text-slate-400 hover:text-green-600 transition-colors mb-10">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            BACK TO FEED
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-green-600 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100">
              {blog.category}
            </Badge>
            {blog.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-100 to-green-50 flex items-center justify-center border border-green-200">
                <User size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{blog.author || 'Alpha World Team'}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.published_at || blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {blog.read_time || '5'} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <Button variant="outline" size="icon" className="rounded-full hover:text-green-600 hover:border-green-200">
                 <Share2 size={18} />
               </Button>
               <Button variant="outline" size="icon" className="rounded-full hover:text-green-600 hover:border-green-200">
                 <Bookmark size={18} />
               </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {blog.image && (
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200">
            <img
              src={blog.image.startsWith('http') ? blog.image : `/images/${blog.image}`}
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
      </div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900">
          <div
            className="dropcap-first-letter"
            dangerouslySetInnerHTML={{
              __html: blog.content.replace(/\n/g, '<br />')
            }}
          />
        </article>

        {/* Exam Context Card */}
        {blog.related_exams.length > 0 && (
          <div className="mt-16 relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 text-white group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-green-500/20 transition-all duration-500" />
            <div className="relative z-10">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <div className="w-2 h-8 bg-green-500 rounded-full" />
                  Related Career Paths
                </h3>
                <div className="flex flex-wrap gap-3">
                  {blog.related_exams.map((exam) => (
                    <div key={exam} className="flex items-center bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-2xl transition-colors cursor-default">
                      <span className="text-sm font-bold tracking-tight">{exam}</span>
                      <ChevronRight size={14} className="ml-2 text-green-500" />
                    </div>
                  ))}
                </div>
            </div>
          </div>
        )}

        {/* Newsletter / CTA */}
      
      </div>
    </div>
  )
}

export default BlogDetailPage