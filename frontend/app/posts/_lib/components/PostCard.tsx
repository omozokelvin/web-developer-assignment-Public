import { Post } from '@/app/posts/_lib/postTypes';
import { Trash2 } from 'lucide-react';

export default function PostCard({
  title,
  body,
}: Pick<Post, 'title' | 'body'>) {
  return (
    <div className="relative p-4 bg-white border border-gray-200 rounded-xl shadow-sm h-64 overflow-hidden group">
      <Trash2 className="absolute top-2 right-2 w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-150" />
      <h3 className="text-lg font-medium mb-2 text-foreground truncate text-[18px]">
        {title}
      </h3>
      <p className="text-sm text-foreground line-clamp-6">{body}</p>
    </div>
  );
}
