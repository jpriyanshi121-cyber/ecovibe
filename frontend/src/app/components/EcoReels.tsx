import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { X, Heart, ShoppingBag, Share2, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { apiFetch, getImageUrl } from "../../lib/api";
import { toast } from "sonner";

interface Comment {
  id: string;
  text: string;
  authorName: string;
}

interface Reel {
  id: string;
  thumbnail: string;
  video: string | null;
  creator: string;
  authorId: string | null;
  content: string;
  product: {
    id: string;
    name: string;
    price: number;
  } | null;
  likesCount: number;
  liked: boolean;
  commentsCount: number;
  following: boolean;
}

interface EcoReelsProps {
  onClose: () => void;
  onShopProduct: (productId: string) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export function EcoReels({ onClose, onShopProduct }: EcoReelsProps) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());

  // Comments panel state
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await apiFetch("/posts");
        const mapped: Reel[] = (data.posts || []).map((p: any) => ({
          id: p._id,
          thumbnail:
            getImageUrl(p.images?.[0]) ||
            getImageUrl(p.taggedProduct?.images?.[0]) ||
            FALLBACK_IMAGE,
          video: getImageUrl(p.video) || null,
          creator: p.author?.name || "EcoVibe Member",
          authorId: p.author?._id || null,
          content: p.content,
          product: p.taggedProduct
            ? { id: p.taggedProduct._id, name: p.taggedProduct.name, price: p.taggedProduct.price }
            : null,
          likesCount: p.likesCount || 0,
          liked: false,
          commentsCount: p.commentsCount || 0,
          following: false,
        }));
        setReels(mapped);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Track which reel is currently in view; play/pause videos accordingly
  useEffect(() => {
    if (reels.length === 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(idx)) return;
          const videoEl = videoRefs.current[idx];
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setCurrentIndex(idx);
            videoEl?.play().catch(() => {});
          } else {
            videoEl?.pause();
          }
        });
      },
      { root: container, threshold: [0.6] }
    );

    reelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reels]);

  const handleLike = useCallback(
    async (e: React.MouseEvent, reelId: string) => {
      e.stopPropagation();
      if (pendingLikes.has(reelId)) return; // ignore double-clicks while a request is in flight

      setPendingLikes((prev) => new Set(prev).add(reelId));
      // Optimistic UI update
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId ? { ...r, liked: !r.liked, likesCount: r.likesCount + (r.liked ? -1 : 1) } : r
        )
      );

      try {
        const res = await apiFetch(`/posts/${reelId}/like`, { method: "POST" });
        // Reconcile with the server's authoritative values (source of truth)
        setReels((prev) =>
          prev.map((r) =>
            r.id === reelId ? { ...r, liked: res.liked, likesCount: res.likesCount } : r
          )
        );
      } catch (err) {
        // Revert optimistic update on failure
        setReels((prev) =>
          prev.map((r) =>
            r.id === reelId ? { ...r, liked: !r.liked, likesCount: r.likesCount + (r.liked ? 1 : -1) } : r
          )
        );
      } finally {
        setPendingLikes((prev) => {
          const next = new Set(prev);
          next.delete(reelId);
          return next;
        });
      }
    },
    [pendingLikes]
  );

  const handleShare = useCallback(async (e: React.MouseEvent, reel: Reel) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/reels/${reel.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "EcoVibe Reel", text: reel.content, url: shareUrl });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return; // user closed the native share sheet — not an error
        // Any other failure (unsupported context, etc.) — fall through to clipboard below
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Couldn't share or copy the link");
    }
  }, []);

  const handleShop = useCallback(
    (e: React.MouseEvent, productId: string) => {
      e.stopPropagation();
      onShopProduct(productId);
    },
    [onShopProduct]
  );

  const handleFollow = useCallback(async (e: React.MouseEvent, reel: Reel) => {
    e.stopPropagation();
    if (!reel.authorId) return;
    try {
      const res = await apiFetch(`/users/${reel.authorId}/follow`, { method: "POST" });
      setReels((prev) =>
        prev.map((r) => (r.id === reel.id ? { ...r, following: res.following } : r))
      );
    } catch (err: any) {
      toast.error(err?.message || "Couldn't follow this creator");
    }
  }, []);

  const openComments = useCallback(async (e: React.MouseEvent, reelId: string) => {
    e.stopPropagation();
    setOpenCommentsFor(reelId);
    setComments([]);
    setCommentsLoading(true);
    try {
      const data = await apiFetch(`/posts/${reelId}`);
      const mapped: Comment[] = (data.post?.comments || []).map((c: any) => ({
        id: c._id,
        text: c.text,
        authorName: c.user?.name || "EcoVibe Member",
      }));
      setComments(mapped);
    } catch (err: any) {
      setComments([]);
      toast.error(err?.message || "Couldn't load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  const closeComments = () => {
    setOpenCommentsFor(null);
    setCommentText("");
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !openCommentsFor || postingComment) return;
    setPostingComment(true);
    try {
      const res = await apiFetch(`/posts/${openCommentsFor}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: commentText.trim() }),
      });
      setComments((prev) => [
        ...prev,
        { id: res.comment._id, text: res.comment.text, authorName: "You" },
      ]);
      setReels((prev) =>
        prev.map((r) =>
          r.id === openCommentsFor ? { ...r, commentsCount: r.commentsCount + 1 } : r
        )
      );
      setCommentText("");
    } catch (err: any) {
      toast.error(err?.message || "Couldn't post comment");
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-white text-xs drop-shadow-lg">EcoReel 🌱</span>
        </div>
      </div>

      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-white text-sm animate-pulse">Loading reels...</span>
        </div>
      ) : error ? (
        <div className="h-full w-full flex items-center justify-center px-8">
          <p className="text-white text-sm text-center">
            Couldn't load reels. Check that the backend server is running.
          </p>
        </div>
      ) : reels.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center px-8">
          <p className="text-white text-sm text-center">
            No reels yet — be the first to share an EcoReel!
          </p>
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            className="h-full w-full max-w-[500px] mx-auto overflow-y-scroll snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reels.map((reel, index) => (
              <div
                key={reel.id}
                ref={(el) => {
                  reelRefs.current[index] = el;
                }}
                data-index={index}
                className="relative h-full w-full snap-start snap-always shrink-0"
              >
                <div className="absolute inset-0 bg-black">
                  {reel.video ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={reel.video}
                      poster={reel.thumbnail}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={reel.thumbnail}
                      alt={reel.content}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70" />
                </div>

                <div className="absolute right-3 bottom-24 z-30 flex flex-col gap-5">
                  <button
                    onClick={(e) => handleLike(e, reel.id)}
                    className="flex flex-col items-center gap-1 disabled:opacity-60"
                    disabled={pendingLikes.has(reel.id)}
                  >
                    <Heart
                      className={`h-7 w-7 drop-shadow-lg transition-all ${
                        reel.liked ? "fill-red-500 text-red-500 scale-110" : "text-white"
                      }`}
                    />
                    <span className="text-white text-xs drop-shadow-lg">
                      {reel.likesCount.toLocaleString()}
                    </span>
                  </button>

                  <button
                    onClick={(e) => openComments(e, reel.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <MessageCircle className="h-7 w-7 text-white drop-shadow-lg" />
                    <span className="text-white text-xs drop-shadow-lg">{reel.commentsCount}</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(e, reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <Share2 className="h-6 w-6 text-white drop-shadow-lg" />
                    <span className="text-white text-xs drop-shadow-lg">Share</span>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-white text-xs">{reel.creator.charAt(0)}</span>
                    </div>
                    <span className="text-white text-sm drop-shadow-lg">{reel.creator}</span>
                    <Button
                      size="sm"
                      onClick={(e) => handleFollow(e, reel)}
                      className={`h-7 px-3 text-xs rounded-lg transition-all ${
                        reel.following
                          ? "bg-white/20 border border-white/50 text-white hover:bg-white/30"
                          : "bg-transparent border border-white/50 hover:bg-white/10 text-white"
                      }`}
                    >
                      {reel.following ? "Following" : "Follow"}
                    </Button>
                  </div>

                  <div className="pr-16">
                    <p className="text-white text-sm drop-shadow-lg line-clamp-2">{reel.content}</p>
                  </div>

                  {reel.product && (
                    <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-3 shadow-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Available Now</p>
                        <p className="text-sm text-gray-900 truncate">{reel.product.name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-lg text-emerald-600">
                          ₹{reel.product.price.toLocaleString("en-IN")}
                        </span>
                        <Button
                          size="sm"
                          onClick={(e) => handleShop(e, reel.product!.id)}
                          className="h-8 px-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg text-xs"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                          Shop
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5">
              {reels.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-white" : "w-1 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Comments panel */}
      {openCommentsFor && (
        <div
          className="absolute inset-0 z-[110] bg-black/50 flex items-end"
          onClick={closeComments}
        >
          <div
            className="w-full max-w-[500px] mx-auto bg-white rounded-t-2xl max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-gray-900 text-sm">Comments</span>
              <button onClick={closeComments}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {commentsLoading ? (
                <p className="text-gray-400 text-sm text-center py-6">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">
                  No comments yet. Be the first!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">{c.authorName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{c.authorName}</p>
                      <p className="text-sm text-gray-900">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() || postingComment}
                className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center disabled:opacity-50 shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}