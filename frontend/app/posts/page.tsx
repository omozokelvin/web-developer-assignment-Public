'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import PageLoading from '@/lib/components/PageLoading';
import PostCard from '@/app/posts/_lib/components/PostCard';
import NewPostCard from '@/app/posts/_lib/components/NewPostCard';
import { useGetUserPosts } from '@/app/posts/_lib/postQueries';
import NewPostModal from '@/app/posts/_lib/components/NewPostModal';
import DeleteModal from '@/lib/components/DeleteModal';
import { useDeletePost } from '@/app/posts/_lib/postMutations';
import Breadcrumb from '@/lib/components/Breadcrumb/Breadcrumb';
import { useGetUser } from '@/app/(users)/_lib/userQueries';

export default function UsersPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId') as string;

  const [isCreateModalOpen, setIsCreateModalOPen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectPostId, setSelectedPostId] = useState('');

  const { data: selectedUser, isLoading: isUserLoading } = useGetUser(userId!);
  const { data: posts = [], isLoading: isPostLoading } = useGetUserPosts(
    userId!
  );
  const { mutate: deletePost, isPending: deletingPost } = useDeletePost(
    userId!
  );

  const reversedPost = useMemo(() => {
    return [...posts].reverse();
  }, [posts]);

  const isLoading = isUserLoading || isPostLoading;

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
      router.back();
      return;
    }
  }, [userId]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[571px] lg:max-w-[856px] mx-auto p-2 rounded-xl">
        <Breadcrumb
          items={[
            {
              title: 'Users',
              onClick: () => {
                router.back();
              },
            },
            {
              title: selectedUser?.name || '',
            },
          ]}
        />

        <h1 className="text-4xl font-medium mb-4 text-foreground">
          {selectedUser?.name}
        </h1>

        <p className="text-md text-mutedForeground mb-12">
          {selectedUser?.email}
          <span className="text-foreground"> • {posts.length} Posts</span>
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
          <NewPostCard onClick={addNewPost} />

          {reversedPost.map((post) => (
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

  // return (
  //   <Suspense fallback={<PageLoading />}>
  //     {isLoading ? (
  //       <PageLoading />
  //     ) : (

  //     )}
  //   </Suspense>
  // );
}
