import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface EditableRuleProps {
  arabic: string;
  latin: string;
  description?: string;
  onUpdate: (latin: string) => void;
  showDescription?: boolean;
}

const EditableRule = ({ arabic, latin, description, onUpdate, showDescription = false }: EditableRuleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(latin);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(latin);
  }, [latin]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== latin) {
      onUpdate(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(latin);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-card rounded-lg group cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <span className="font-arabic text-base sm:text-lg">{arabic}</span>
      <span className="text-muted-foreground text-xs">→</span>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-12 sm:w-16 px-1 py-0.5 text-xs sm:text-sm font-medium bg-background border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ) : (
        <span className="font-medium text-xs sm:text-sm min-w-[1.5rem]">
          {latin || '∅'}
          <Pencil className="w-2.5 h-2.5 inline-block ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
        </span>
      )}
      {showDescription && description && (
        <span className="text-xs text-muted-foreground ml-auto truncate hidden sm:inline">{description}</span>
      )}
    </div>
  );
};

export default EditableRule;
