import { Post } from '@/app/posts/_lib/postTypes';
import { Trash2 } from 'lucide-react';

interface Props extends Pick<Post, 'id' | 'title' | 'body'> {
  onDelete: (id: string) => void;
}

export default function PostCard({ id, title, body, onDelete }: Props) {
  return (
    <div className="relative p-4 bg-white border border-gray-200 rounded-xl shadow-sm h-64 overflow-hidden group">
      <Trash2
        className="absolute top-2 right-2 w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-150"
        onClick={() => onDelete(id)}
      />

      <h3 className="text-lg font-medium mb-2 text-foreground truncate text-[18px]">
        {title}
      </h3>
      <p className="text-sm text-foreground line-clamp-6">{body}</p>
    </div>
  );
}
