import { Plus, PlusCircle } from 'lucide-react';
import styles from './NewPostCard.module.css';

interface Props {
  onClick: () => void;
}

export default function NewPostCard({ onClick }: Props) {
  return (
    <button
      className={`flex flex-col items-center justify-center bg-white h-[293px] text-foreground shadow-sm ${styles['border-dashed-rounded']}`}
      onClick={onClick}
    >
      <PlusCircle className="w-6 h-6 mb-2" />
      <span className="text-sm font-medium">New Post</span>
    </button>
  );
}
