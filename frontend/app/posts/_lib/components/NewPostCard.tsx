import { Plus, PlusCircle } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function NewPostCard({ onClick }: Props) {
  return (
    <button
      className="flex flex-col items-center justify-center p-4 bg-white border border-dashed border-gray-300 rounded-xl h-64 text-foreground hover:text-foreground hover:border-gray-400 transition-colors duration-150"
      onClick={onClick}
    >
      <PlusCircle className="w-6 h-6 mb-2" />
      <span className="text-sm font-medium">New Post</span>
    </button>
  );
}
