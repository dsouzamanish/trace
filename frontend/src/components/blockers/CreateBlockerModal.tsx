import { useState } from 'react';
import { BlockerCategory, BlockerSeverity } from '../../types';

interface CreateBlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    category: BlockerCategory;
    severity: BlockerSeverity;
  }) => void;
  isLoading?: boolean;
}

const categories: BlockerCategory[] = [
  'Process',
  'Technical',
  'Dependency',
  'Infrastructure',
  'Other',
];

const severities: BlockerSeverity[] = ['Low', 'Medium', 'High'];

export default function CreateBlockerModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateBlockerModalProps) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BlockerCategory>('Technical');
  const [severity, setSeverity] = useState<BlockerSeverity>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, category, severity });
    setDescription('');
    setCategory('Technical');
    setSeverity('Medium');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="card w-full max-w-lg mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-white">
            Report a Blocker
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's blocking your progress..."
              className="input w-full h-32 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlockerCategory)}
                className="select w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as BlockerSeverity)}
                className="select w-full"
              >
                {severities.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Blocker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

