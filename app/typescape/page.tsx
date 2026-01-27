'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { typescapeRegistry } from '@/content/typescape/registry'
import type { ScenarioMeta } from '@/lib/content/scenario.model'

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'advanced':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function TypescapeCard({ scenario }: { scenario: ScenarioMeta }) {
  // Handle cases where scenario might be incomplete
  if (!scenario?.name || !scenario?.slug) {
    return null
  }

  const handleNavigation = () => {
    // Set navigation state to help detect the TypeScript import resolution bug
    window.history.replaceState({ from: 'typescape-browse' }, '', window.location.pathname)
  }
  
  return (
    <Link 
      href={`/typescape/${scenario.slug}`}
      onClick={handleNavigation}
      className="group flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {scenario.name}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
            {scenario.difficulty}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {scenario.blurb}
        </p>
        <div className="flex flex-wrap gap-1">
          {scenario.tags?.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
              {tag}
            </span>
          ))}
          {scenario.tags && scenario.tags.length > 4 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
              +{scenario.tags.length - 4} more
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
    </Link>
  )
}

export default function TypescapeBrowsePage() {
  // Filter valid scenarios
  const validScenarios = typescapeRegistry.filter(
    (scenario) => scenario?.name && scenario?.slug && scenario?.difficulty && scenario?.tags
  )
  const allTags = Array.from(
    new Set(validScenarios.flatMap((scenario) => scenario.tags))
  ).sort((a, b) => a.localeCompare(b))

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | ScenarioMeta['difficulty']>('all')
  const [tagFilter, setTagFilter] = useState<string | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredScenarios = validScenarios.filter((scenario) => {
    if (difficultyFilter !== 'all' && scenario.difficulty !== difficultyFilter) {
      return false
    }

    if (tagFilter !== 'all' && !scenario.tags.includes(tagFilter)) {
      return false
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const text = `${scenario.name} ${scenario.blurb} ${scenario.tags.join(' ')}`.toLowerCase()
      return text.includes(query)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                typescape
              </h1>
            </div>
            <span className="text-sm text-gray-500 font-medium">Interactive TypeScript Playground</span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Interactive Typescapes
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Master advanced TypeScript concepts through interactive coding environments. 
              Each typescape provides guided examples and immediate feedback.
            </p>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="mb-8 space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search typescapes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <span className="uppercase tracking-wide text-gray-500">Difficulty</span>
              <select
                value={difficultyFilter}
                onChange={(event) =>
                  setDifficultyFilter(
                    event.target.value as 'all' | ScenarioMeta['difficulty']
                  )
                }
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            {allTags.length > 0 && (
              <label className="flex items-center gap-2">
                <span className="uppercase tracking-wide text-gray-500">Tag</span>
                <select
                  value={tagFilter}
                  onChange={(event) => setTagFilter(event.target.value as string | 'all')}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <span className="ml-auto text-gray-500">
              Showing {filteredScenarios.length} of {validScenarios.length} typescapes
            </span>
          </div>
        </div>

        {/* Typescape List */}
        <section className="space-y-4">
          {filteredScenarios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-2">No typescapes found</p>
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'Try adjusting your search query' : 'Check back later for new content'}
              </p>
            </div>
          ) : (
            filteredScenarios.map((scenario) => (
              <TypescapeCard key={scenario.slug} scenario={scenario} />
            ))
          )}
        </section>
      </div>
    </div>
  )
}
