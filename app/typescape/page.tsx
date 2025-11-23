'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Target, Users, Zap } from 'lucide-react'
import { typescapeRegistry } from '@/content/typescape/registry'
import type { ScenarioMeta } from '@/lib/content/scenario.model'

function getDifficultyIcon(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return <Users className="h-4 w-4 text-green-600" />
    case 'intermediate':
      return <Target className="h-4 w-4 text-yellow-600" />
    case 'advanced':
      return <Zap className="h-4 w-4 text-red-600" />
    default:
      return <BookOpen className="h-4 w-4 text-gray-600" />
  }
}

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
  
  return (
    <Link 
      href={`/typescape/${scenario.slug}`}
      className="group block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {scenario.name}
          </h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            {scenario.blurb}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
          {getDifficultyIcon(scenario.difficulty)}
          {scenario.difficulty}
        </div>
      </div>
      
      {scenario.tags && scenario.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {scenario.tags.slice(0, 4).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {scenario.tags.length > 4 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
              +{scenario.tags.length - 4} more
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

export default function TypescapeBrowsePage() {
  // Filter valid scenarios and prepare metadata for filters
  const validScenarios = typescapeRegistry.filter(
    (scenario) => scenario?.name && scenario?.slug && scenario?.difficulty && scenario?.tags
  )

  const allTags = Array.from(
    new Set(validScenarios.flatMap((scenario) => scenario.tags))
  ).sort((a, b) => a.localeCompare(b))

  const [difficultyFilter, setDifficultyFilter] = useState<'all' | ScenarioMeta['difficulty']>('all')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredScenarios = validScenarios.filter((scenario) => {
    if (difficultyFilter !== 'all' && scenario.difficulty !== difficultyFilter) {
      return false
    }

    if (tagFilter && !scenario.tags.includes(tagFilter)) {
      return false
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const text = `${scenario.name} ${scenario.blurb} ${scenario.tags.join(' ')}`.toLowerCase()
      return text.includes(query)
    }

    return true
  })

  const totalLearningGoals = validScenarios.reduce(
    (total, scenario) => total + scenario.learningGoals.length,
    0
  )

  const hasBeginner = validScenarios.some((scenario) => scenario.difficulty === 'beginner')
  const hasIntermediate = validScenarios.some((scenario) => scenario.difficulty === 'intermediate')
  const hasAdvanced = validScenarios.some((scenario) => scenario.difficulty === 'advanced')

  const difficultySummary = [
    hasBeginner && 'Beginner',
    hasIntermediate && 'Intermediate',
    hasAdvanced && 'Advanced',
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
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
            <h2 className="text-4xl font-bold text-gray-900">
              Interactive Typescapes
            </h2>
            <p className="text-gray-600 mt-2">
              Master advanced TypeScript concepts through interactive coding environments
            </p>
          </div>
          
          <p className="text-lg text-gray-700 max-w-3xl">
            Master advanced TypeScript concepts through interactive coding environments. Each typescape provides 
            a complete learning experience with guided examples, real-world patterns, and immediate feedback.
          </p>
        </header>

        {/* Stats */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 justify-between">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{validScenarios.length}</div>
                <div className="text-gray-600 text-sm">Total Typescapes</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 justify-between">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{allTags.length}</div>
                <div className="text-gray-600 text-sm">Unique Tags</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 justify-between">
              <Target className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-xl font-semibold text-gray-900">
                  {difficultySummary || 'No difficulty data'}
                </div>
                <div className="text-gray-600 text-sm">Skill Levels</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 justify-between">
              <Zap className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalLearningGoals}</div>
                <div className="text-gray-600 text-sm">Learning Goals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-10 bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:w-1/2">
              <label
                htmlFor="typescape-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search typescapes
              </label>
              <input
                id="typescape-search"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, description, or tag..."
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 md:flex-row md:justify-end">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Difficulty</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All levels' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDifficultyFilter(option.value as 'all' | ScenarioMeta['difficulty'])
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        difficultyFilter === option.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="md:min-w-[14rem]">
                  <div className="text-sm font-medium text-gray-700 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => setTagFilter(null)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        tagFilter === null
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      All tags
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setTagFilter((current) => (current === tag ? null : tag))
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          tagFilter === tag
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Typescape list */}
        <section className="mb-12" aria-label="Typescape list">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse Typescapes</h2>
            <p className="text-sm text-gray-500">
              Showing {filteredScenarios.length} of {validScenarios.length} typescapes
            </p>
          </div>

          {filteredScenarios.length === 0 ? (
            <p className="text-sm text-gray-600">
              No typescapes match your filters. Try adjusting the difficulty, tags, or search
              query.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredScenarios.map((scenario) => (
                <TypescapeCard key={scenario.slug} scenario={scenario} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12 mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ready to get started?</h3>
              <p className="text-gray-600 text-sm">
                Each typescape includes interactive examples and guided learning.
              </p>
            </div>
            <Link 
              href="/docs/typist"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Documentation
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
