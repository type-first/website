'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, MessageSquare, MoreHorizontal, Minus, Plus } from 'lucide-react';
import { CommunityComment } from '@/modules/db/v0/community';
import CommentForm from './comment.form.client';

interface CommentThreadProps {
  comment: CommunityComment;
  postSlug: string;
  isAuthed: boolean;
  depth?: number;
  maxDepth?: number;
}

export default function CommentThread({ 
  comment, 
  postSlug, 
  isAuthed, 
  depth = 0, 
  maxDepth = 6 
}: CommentThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [score, setScore] = useState(Math.floor(Math.random() * 20) - 5); // Random demo score
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  
  // Calculate indentation based on depth (max 6 levels like Reddit)
  const actualDepth = Math.min(depth, maxDepth);
  
  // Reddit-style colors for nested levels
  const borderColors = [
    'border-l-blue-400',
    'border-l-green-400', 
    'border-l-yellow-400',
    'border-l-red-400',
    'border-l-purple-400',
    'border-l-pink-400',
    'border-l-gray-400'
  ];
  const borderColor = borderColors[actualDepth % borderColors.length];

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleVote = (voteType: 'up' | 'down') => {
    if (!isAuthed) return;
    
    if (userVote === voteType) {
      setUserVote(null);
    } else {
      setUserVote(voteType);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'now';
  };

  const getDisplayScore = () => {
    let displayScore = score;
    if (userVote === 'up') displayScore += 1;
    if (userVote === 'down') displayScore -= 1;
    return displayScore;
  };

  return (
    <div className={`${depth > 0 ? `border-l-2 ${borderColor} ml-4 pl-4` : ''}`}>
      <div className={`bg-white ${depth === 0 ? 'border border-gray-200 rounded-lg p-4' : 'py-2'}`}>
        <div className="flex gap-2">
          {/* Vote Section */}
          <div className="flex flex-col items-center min-w-[32px] pt-1">
            <button
              onClick={() => handleVote('up')}
              disabled={!isAuthed}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                userVote === 'up' ? 'text-orange-500' : 'text-gray-400'
              } ${!isAuthed ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <ChevronUp className="w-4 h-4" strokeWidth={2} />
            </button>
            
            <span className={`text-xs font-bold px-1 ${
              getDisplayScore() > 0 ? 'text-orange-500' : 
              getDisplayScore() < 0 ? 'text-blue-500' : 'text-gray-500'
            }`}>
              {getDisplayScore()}
            </span>
            
            <button
              onClick={() => handleVote('down')}
              disabled={!isAuthed}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                userVote === 'down' ? 'text-blue-500' : 'text-gray-400'
              } ${!isAuthed ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Comment Header */}
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <button
                onClick={handleToggleCollapse}
                className="flex items-center gap-1 hover:text-gray-800 transition-colors"
              >
                {isCollapsed ? (
                  <Plus className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
              </button>
              <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                {comment.author}
              </span>
              <span className="text-gray-400">•</span>
              <span className="hover:underline cursor-pointer">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.replies.length > 0 && isCollapsed && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600">
                    {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                </>
              )}
            </div>

            {/* Comment Body */}
            {!isCollapsed && (
              <>
                <div className="text-gray-900 mb-2 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </div>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  {isAuthed && (
                    <button
                      onClick={handleReply}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors font-medium"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  )}
                  
                  <button className="hover:text-gray-700 transition-colors font-medium">
                    Share
                  </button>
                  
                  <button className="hover:text-gray-700 transition-colors font-medium">
                    Save
                  </button>
                  
                  <button className="hover:text-gray-700 transition-colors">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>

                {/* Reply Form */}
                {showReplyForm && isAuthed && (
                  <div className="mb-4">
                    <CommentForm 
                      postSlug={postSlug} 
                      parentId={comment.id}
                      onCancel={() => setShowReplyForm(false)}
                      placeholder={`Reply to ${comment.author}...`}
                    />
                  </div>
                )}

                {/* Nested Replies */}
                {comment.replies.length > 0 && (
                  <div className="space-y-3 mt-3">
                    {comment.replies.map(reply => (
                      <CommentThread
                        key={reply.id}
                        comment={reply}
                        postSlug={postSlug}
                        isAuthed={isAuthed}
                        depth={depth + 1}
                        maxDepth={maxDepth}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}