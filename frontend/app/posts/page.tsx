'use client';
import { routes } from '@/lib/constants/routes'; // Assuming this path is correct
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import PageLoading from '@/lib/components/PageLoading';
import { useUserStore } from '@/app/(users)/_lib/userStore';
import PostCard from '@/app/posts/_lib/components/PostCard';
import NewPostCard from '@/app/posts/_lib/components/NewPostCard';
import { useGetUserPosts } from '@/app/posts/_lib/postQueries';
import NewPostModal from '@/app/posts/_lib/components/NewPostModal';
import DeleteModal from '@/lib/components/DeleteModal';
import { useDeletePost } from '@/app/posts/_lib/postMutations';

export default function UsersPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId') as string;

  const [isCreateModalOpen, setIsCreateModalOPen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectPostId, setSelectedPostId] = useState('');

  const { data: posts = [], isLoading } = useGetUserPosts(userId!);
  const { mutate: deletePost, isPending: deletingPost } = useDeletePost(
    userId!
  );

  const { selectedUser } = useUserStore();

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPostId('');
  };

  const handleDelete = () => {
    deletePost(selectPostId, {
      onSuccess: () => {
        closeDeleteModal();
      },
    });
  };

  const addNewPost = () => {
    setIsCreateModalOPen(true);
  };

  useEffect(() => {
    if (!userId) {
      router.push(routes.home);
    }
  }, [userId]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto p-6 rounded-xl">
        <p className="text-sm text-mutedForeground mb-2">
          Breadcrumb Item &gt; {selectedUser?.name}
        </p>

        <h1 className="text-4xl font-medium mb-2 text-foreground">
          {selectedUser?.name}
        </h1>

        <p className="text-md text-mutedForeground mb-6">
          {selectedUser?.email}
          <span className="text-foreground"> • {posts.length} Posts</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2  md:grid-cols- gap-6 sm:grid-cols-gap-4">
          <NewPostCard onClick={addNewPost} />

          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              body={post.body}
              onDelete={() => {
                setIsDeleteModalOpen(true);
                setSelectedPostId(post.id);
              }}
            />
          ))}
        </div>
      </div>

      <NewPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOPen(false)}
        userId={userId}
      />

      <DeleteModal
        title="Delete post"
        subtitle="Are you sure you want to delete this post?"
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        isDeleting={deletingPost}
        onConfirm={handleDelete}
      />
    </div>
  );
}
